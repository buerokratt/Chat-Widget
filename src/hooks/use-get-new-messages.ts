import { useEffect, useRef, useState } from "react";
import { useNotificationEvents } from "@buerokratt-ria/notifications/react";
import { useAppDispatch } from "../store";
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

const useGetNewMessages = (): void => {
  const { lastReadMessageTimestamp, isChatEnded, chatId } = useChatSelector();
  const dispatch = useAppDispatch();
  const [lastReadMessageTimestampValue, setLastReadMessageTimestampValue] =
    useState("");
  const initialMessageTimestamp = useRef("");
  const currentStreamContent = useRef("");
  const currentStreamId = useRef("");
  const currentStreamUuid = useRef("");
  const currentStreamStartTime = useRef("");

  useEffect(() => {
    if (lastReadMessageTimestamp && !lastReadMessageTimestampValue) {
      initialMessageTimestamp.current = lastReadMessageTimestamp;
      setLastReadMessageTimestampValue(lastReadMessageTimestamp);
    }
  }, [lastReadMessageTimestamp]);

  const canSubscribe = Boolean(
    !isChatEnded && chatId && lastReadMessageTimestampValue
  );

  useNotificationEvents({
    eventTypes: [
      "message",
      "stream_start",
      "stream_chunk",
      "stream_complete",
      "stream_error",
      "complete_response",
    ] as const,
    listener: async (event) => {
      if (!canSubscribe) return;
      const notification = event.data as any;
      const type = event.type;
      if (!notification) return;

      const data = notification.payload;
      if (type === "message") {
        const result = await dispatch(
          getNewMessages({ timeRangeBegin: initialMessageTimestamp.current.split("+")[0] })
        );

        if (result.payload && Array.isArray(result.payload)) {
          const messages: Message[] = result.payload;

          if (messages.length !== 0) {
            setLastReadMessageTimestampValue(
              messages[messages.length - 1].created ??
              initialMessageTimestamp.current
            );
            dispatch(
              addMessagesToDisplay(messages.filter(isDisplayableMessages))
            );
            dispatch(
              handleStateChangingEventMessages(
                messages.filter(isStateChangingEventMessage)
              )
            );
          }
        }
      } else if (type === "stream_start") {
        currentStreamContent.current = "";
        currentStreamId.current = data.streamId ?? data.channelId;
        currentStreamUuid.current = uuidv4();
        currentStreamStartTime.current = new Date().toISOString();
        dispatch(setTypingStream(true));
      } else if (type === "stream_chunk" && data.channelId === chatId) {
        if (!currentStreamUuid.current) {
          currentStreamId.current = data.streamId ?? data.channelId;
          currentStreamUuid.current = uuidv4();
          currentStreamStartTime.current = new Date().toISOString();
        }

        dispatch(setTypingStream(true));
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
        setTimeout(() => {
          dispatch(setShowLoadingMessage(false));
        }, 0);
        dispatch(setTypingStream(false));
        dispatch(addMessagesToDisplay([message]));
        dispatch(sendNewLlmMessage({ message, context: data.context, uuid }));
      }
    },
  });

  useEffect(() => {
    return () => {
      if (currentStreamId.current) {
        dispatch(clearStreamingMessage(currentStreamId.current));
        dispatch(setTypingStream(false));
      }
    };
  }, [canSubscribe, chatId, dispatch]);
};

export default useGetNewMessages;
