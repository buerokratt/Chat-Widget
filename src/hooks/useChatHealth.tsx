import { useAppDispatch } from "../store";
import useChatSelector from "./use-chat-selector";
import {useEffect} from "react";

export const useChatHealth = () => {
  const { isChatOffline } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {

  }, [])
}

export default useChatHealth;
