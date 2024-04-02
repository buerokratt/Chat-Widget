import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { CHAT_EVENTS } from "../constants";
import { addChatToTerminationQueue, removeChatFromTerminationQueue } from "../slices/chat-slice";
import useChatSelector from "./use-chat-selector";
import { isRedirectPathEmpty } from "../utils/auth-utils";
import { wasPageReloaded, isLastSession } from "../utils/browser-utils";

const isChatAboutToBeTerminated = () => {
  const terminationTime = sessionStorage.getItem('terminationTime');
  if(terminationTime)
    return 2000 < (Date.now() - parseInt(terminationTime));
  return false;
}

const useReloadChatEndEffect = () => {
  const { chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(wasPageReloaded() && isChatAboutToBeTerminated()) {
      dispatch(removeChatFromTerminationQueue())
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatId && isRedirectPathEmpty() && isLastSession()) {
        localStorage.setItem("sessions", "1");
        dispatch(
          addChatToTerminationQueue({
            event: CHAT_EVENTS.CLIENT_LEFT_FOR_UNKNOWN_REASONS,
            isUpperCase: true,
          })
        );
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        handleBeforeUnload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [chatId]);
}

export default useReloadChatEndEffect;
