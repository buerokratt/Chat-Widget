import { useEffect } from "react";
import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";
import { getChatConfig } from "../slices/chat-slice";

const useGetChatConfig = (): void => {
  const { chatConfig } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatConfig.isLoaded) dispatch(getChatConfig());
  }, [dispatch, chatConfig]);
};

export default useGetChatConfig;
