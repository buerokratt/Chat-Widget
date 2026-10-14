import { useEffect } from "react";
import { useNotificationEvents } from "@buerokratt-ria/notifications/react";
import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";
import useAuthenticationSelector from "./use-authentication-selector";
import { setChat } from "../slices/chat-slice";
import { setIsNotAuthenticated } from "../slices/authentication-slice";
import chatService from "../services/chat-service";

const useGetChat = (): void => {
  const { isAuthenticated } = useAuthenticationSelector();
  const { isChatEnded, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useNotificationEvents({
    eventTypes: "*",
    listener: async ({ data }) => {
      if (isChatEnded || !chatId) return;
      if (typeof data !== "object" || data === null) return;
      if ((data as { type?: string }).type !== "message") return;

      const chat = await chatService.getChatById(chatId);
      dispatch(setChat(chat));
    },
  });

  useEffect(() => {
    if (isChatEnded || !chatId) {
      if (isAuthenticated) {
        dispatch(setIsNotAuthenticated());
      }
    }
  }, [chatId, dispatch, isAuthenticated, isChatEnded]);
};

export default useGetChat;
