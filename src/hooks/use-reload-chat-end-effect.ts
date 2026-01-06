import { useEffect } from "react";
import { useAppDispatch } from "../store";
import {
  addChatToTerminationQueue,
  removeChatFromTerminationQueue,
} from "../slices/chat-slice";
import useChatSelector from "./use-chat-selector";
import {isLastSession, isWentToTim} from "../utils/browser-utils";

const useReloadChatEndEffect = () => {
  const { chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeChatFromTerminationQueue());
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatId && isLastSession() && !isWentToTim()) {
        dispatch(addChatToTerminationQueue());
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "F5" && event.ctrlKey && event.key === "r") {
        handleBeforeUnload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [chatId, dispatch]);
};

export default useReloadChatEndEffect;
