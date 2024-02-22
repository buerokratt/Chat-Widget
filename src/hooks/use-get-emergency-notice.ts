import { useEffect } from "react";
import { CHAT_EVENTS } from "../constants";
import { getEmergencyNotice, addMessage } from "../slices/chat-slice";
import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";

const useGetEmergencyNotice = (): void => {
  const { emergencyNotice, messages, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (emergencyNotice === null) {
      dispatch(getEmergencyNotice());
      return;
    }

    if (!messages.map((m) => m.event).includes(CHAT_EVENTS.EMERGENCY_NOTICE)) {
      console.log("hi");
      if (!emergencyNotice.isVisible) return;
      console.log("hi2");
      if (new Date(emergencyNotice.start) <= new Date() && new Date(emergencyNotice.end) >= new Date()) {
        console.log("hi3");
        dispatch(
          addMessage({
            chatId,
            event: CHAT_EVENTS.EMERGENCY_NOTICE,
            content: emergencyNotice.text,
            authorTimestamp: new Date().toISOString(),
            authorRole: "chatbot",
          })
        );
      }
    }
  }, [dispatch, emergencyNotice, chatId]);
};

export default useGetEmergencyNotice;
