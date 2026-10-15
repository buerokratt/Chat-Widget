import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../store";
import sse from "../services/sse-service";
import useChatSelector from "./use-chat-selector";
import { Message } from "../model/message-model";
import {
  addMessagesToDisplay,
  clearStreamingMessage,
  getNewMessages,
  handleStateChangingEventMessages,
  sendNewLlmMessage,
  setShowLoadingMessage,
  setTypingStream,
  updateStreamingMessage,
} from "../slices/chat-slice";
import {
  isDisplayableMessages,
  isStateChangingEventMessage,
} from "../utils/state-management-utils";
import { v4 as uuidv4 } from "uuid";

const getLatestUpdatedTimestamp = (messages: Message[], current: string): string =>
  messages.reduce((latest, message) => {
    const timestamp = message.updated ?? message.created;
    return timestamp && new Date(timestamp).getTime() > new Date(latest).getTime() ? timestamp : latest;
  }, current);

const useGetNewMessages = (): void => {
  const { lastReadMessageTimestamp, isChatEnded, chatId } = useChatSelector();
  const dispatch = useAppDispatch();
  const [sseUrl, setSseUrl] = useState("");
  const [lastReadMessageTimestampValue, setLastReadMessageTimestampValue] =
    useState("");
  const lastReadMessageTimestampRef = useRef("");
  const isFetchingNewMessages = useRef(false);
  const hasPendingFetch = useRef(false);
  const currentStreamContent = useRef("");
  const currentStreamId = useRef("");
  const currentStreamUuid = useRef("");
  const currentStreamStartTime = useRef("");

  useEffect(() => {
    if (lastReadMessageTimestamp && !lastReadMessageTimestampValue) {
      lastReadMessageTimestampRef.current = lastReadMessageTimestamp;
      setLastReadMessageTimestampValue(lastReadMessageTimestamp);
    }
  }, [lastReadMessageTimestamp]);

  useEffect(() => {
    if (isChatEnded || !chatId) {
      setSseUrl("");
    } else if (chatId && lastReadMessageTimestampValue) {
      setSseUrl(`/notifications/${chatId}`);
    }
  }, [isChatEnded, chatId, lastReadMessageTimestampValue]);

  useEffect(() => {
    let events: EventSource | undefined;
    if (sseUrl) {
      const onMessage = async (data: any) => {
        if (!data) return;
        const type = data.type;
        if (type === "message") {
          if (isFetchingNewMessages.current) {
            hasPendingFetch.current = true;
            return;
          }
          isFetchingNewMessages.current = true;
          try {
            do {
              hasPendingFetch.current = false;
              const result = await dispatch(
                getNewMessages({ timeRangeBegin: lastReadMessageTimestampRef.current.split("+")[0] })
              );

              if (result.payload && Array.isArray(result.payload)) {
                const messages: Message[] = result.payload;

                if (messages.length !== 0) {
                  lastReadMessageTimestampRef.current = getLatestUpdatedTimestamp(messages, lastReadMessageTimestampRef.current);
                  dispatch(addMessagesToDisplay(messages.filter(isDisplayableMessages)));
                  dispatch(handleStateChangingEventMessages(messages.filter(isStateChangingEventMessage)));
                }
              }
            } while (hasPendingFetch.current);
          } finally {
            isFetchingNewMessages.current = false;
          }
        } else if (type === "stream_start") {
          currentStreamContent.current = "";
          currentStreamId.current = data.streamId;
          currentStreamUuid.current = uuidv4();
          currentStreamStartTime.current = new Date().toISOString();
          dispatch(setTypingStream(true));
        } else if (type === "stream_chunk" && data.channelId === chatId) {
          currentStreamContent.current += data.content;

          const updatedMessage: Message = {
            id: currentStreamUuid.current,
            content: currentStreamContent.current,
            authorRole: "assistant",
            created: currentStreamStartTime.current,
            isStreaming: true,
            streamId: data.channelId,
            chatId: chatId,
            authorTimestamp: currentStreamStartTime.current,
            context: data.context,
          };

          dispatch(updateStreamingMessage(updatedMessage));
        } else if (type === "stream_complete" && data.channelId === chatId) {
          const finalMessage: Message = {
            id: currentStreamUuid.current,
            content: currentStreamContent.current,
            authorRole: "assistant",
            created: currentStreamStartTime.current,
            isStreaming: false,
            streamId: data.channelId,
            chatId: chatId,
            authorTimestamp: currentStreamStartTime.current,
            context: data.context,
          };

          dispatch(updateStreamingMessage(finalMessage));

          currentStreamContent.current = "";
          currentStreamId.current = "";
          currentStreamUuid.current = "";
          currentStreamStartTime.current = "";
        } else if (type === "stream_error" && data.channelId === chatId) {
          dispatch(clearStreamingMessage(data.channelId));
          dispatch(setTypingStream(false));
          currentStreamContent.current = "";
          currentStreamId.current = "";
          currentStreamUuid.current = "";
          currentStreamStartTime.current = "";
        } else if (type === "complete_response") {
          const uuid = uuidv4();
          const currentTime = new Date().toISOString();
          const message: Message = {
            id: uuid,
            content: data.content,
            authorRole: "assistant",
            created: currentTime,
            isStreaming: undefined,
            chatId: chatId,
            authorTimestamp: currentTime,
          };
          setTimeout(() => { dispatch(setShowLoadingMessage(false)); }, 0);
          dispatch(setTypingStream(false));
          dispatch(addMessagesToDisplay([message]));
          dispatch(sendNewLlmMessage({ message, context: data.context, uuid }));
        }
      };

      events = sse(sseUrl, onMessage);
    }
    return () => {
      events?.close();
      if (currentStreamId.current) {
        dispatch(clearStreamingMessage(currentStreamId.current));
        dispatch(setTypingStream(false));
      }
    };
  }, [sseUrl]);
};

export default useGetNewMessages;
