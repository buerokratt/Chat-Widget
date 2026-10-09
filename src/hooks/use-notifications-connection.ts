import { useEffect } from "react";
import { useNotificationsClient } from "@buerokratt-ria/notifications/react";
import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";
import { getChatMessages } from "../slices/chat-slice";

const useNotificationsConnection = (): void => {
  const { chatId, chatStatus, isChatEnded } = useChatSelector();
  const notificationsClient = useNotificationsClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // A restored chat starts with no local status. Wait for getChat() to load
    // the server status before opening SSE, otherwise an already-ended chat
    // briefly reconnects while that request is in flight.
    if (chatStatus === null || isChatEnded || !chatId) {
      notificationsClient.disconnect();
      return;
    }

    let previousStatus = notificationsClient.getState().status;
    const unsubscribeFromState = notificationsClient.subscribeToState(() => {
      const status = notificationsClient.getState().status;

      if (status === "connected" && previousStatus !== "connected") {
        dispatch(getChatMessages());
      }

      previousStatus = status;
    });

    notificationsClient.connect({ chatUuids: chatId });

    return () => {
      unsubscribeFromState();
      notificationsClient.disconnect();
    };
  }, [chatId, chatStatus, dispatch, isChatEnded, notificationsClient]);
};

export default useNotificationsConnection;
