import { useEffect } from "react";
import { getEmergencyNotice } from "../slices/chat-slice";
import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";

const useGetEmergencyNotice = (): void => {
  const { emergencyNotice, messages, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (emergencyNotice === null) {
      dispatch(getEmergencyNotice());
    }
  }, [dispatch, emergencyNotice, messages, chatId]);
};

export default useGetEmergencyNotice;
