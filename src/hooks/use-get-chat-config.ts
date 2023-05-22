import { useEffect } from "react";
import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";
import { getChatConfig } from "../slices/chat-slice";

const useGetChatConfig = (): void => {
  const { config } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!config.isLoaded) dispatch(getChatConfig());
  }, [dispatch, config]);
};

export default useGetChatConfig;
