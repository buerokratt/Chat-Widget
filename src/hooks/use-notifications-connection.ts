import { useEffect } from "react";
import { useNotificationsClient } from "@buerokratt-ria/notifications/react";
import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";
import { getChatMessages } from "../slices/chat-slice";

const useNotificationsConnection = (): void => {
  const { chatId, isChatEnded } = useChatSelector();
  const notificationsClient = useNotificationsClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isChatEnded || !chatId) {
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
  }, [chatId, dispatch, isChatEnded, notificationsClient]);
};

export default useNotificationsConnection;
