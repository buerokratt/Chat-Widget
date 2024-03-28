import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { CHAT_EVENTS } from "../constants";
import { addChatToTerminationQueue, removeChatFromTerminationQueue } from "../slices/chat-slice";
import useChatSelector from "./use-chat-selector";
import { isRedirectPathEmpty } from "../utils/auth-utils";

const isLastSession = () => {
  const sessions = localStorage.getItem("sessions");
  return sessions && parseInt(sessions) === 1;
}

const wasPageReloaded = () => {
  return window.performance
    .getEntriesByType('navigation')
    .map((nav) => (nav as PerformanceNavigationTiming).type)
    .includes('reload');
}

const isChatAboutToBeTerminated = () => {
  const terminationTime = sessionStorage.getItem('terminationTime');
  if(terminationTime)
    return 2000 < (Date.now() - parseInt(terminationTime));
  return false;
}

const useReloadChatEndEffect = () => {
  const { chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  if(wasPageReloaded() && isChatAboutToBeTerminated()) {
    dispatch(removeChatFromTerminationQueue())
  }

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
