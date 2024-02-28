import { useEffect, useState } from "react";
import { useAppDispatch } from "../store";
import { CHAT_EVENTS } from "../constants";
import { endChat } from "../slices/chat-slice";
import useChatSelector from "./use-chat-selector";
import { isRedirectPathEmpty } from "../utils/auth-utils";
import { set } from "date-fns";

const useReloadChatEndEffect = () => {
  const { chatId } = useChatSelector();
  const dispatch = useAppDispatch();
  

  useEffect(() => {
    var left = parseInt(sessionStorage.getItem("left") ?? "0");
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // console.log(document.visibilityState);
      if (left && Date.now() - left < 2000) {
        console.log("unload: refreshed");
      } else {
        console.log("unload: closed");
      }
      sessionStorage.setItem("left", Date.now().toString());
      const sessions = localStorage.getItem("sessions");
      if (chatId && isRedirectPathEmpty() && sessions && parseInt(sessions) === 1) {
        // if (document.visibilityState === "hidden") {
        //   console.log("Unload: Tab is being closed or switched");
        // } else if (document.visibilityState === "visible") {
        //   console.log("Unload: Tab is being reloaded");
        // }
        // localStorage.setItem("sessions", "1");
        // if (document.visibilityState === "hidden") {
        //   console.log("Tab is being closed or switched");
        //    dispatch(
        //      endChat({
        //        event: CHAT_EVENTS.CLIENT_LEFT_FOR_UNKNOWN_REASONS,
        //        isUpperCase: true,
        //      })
        //    );
        // } else if (document.visibilityState === "visible") {
        //   console.log("Tab is being reloaded");
        // }
        
          console.log("closed");
        
      }
      return false;
    };

    if (left && (Date.now() - left) < 2000) {
      console.log("left: refreshed");
    } else {
      console.log("left: closed")
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        handleBeforeUnload(event);
      }
    };

    const handleVisibilityChange = () => {
      // const navigationType = (
      //   window.performance.getEntriesByType(
      //     "navigation"
      //   )[0] as PerformanceNavigationTiming
      // ).type;

      // console.log("navigationType", navigationType);

      //   const sessions = localStorage.getItem("sessions");
      //   if (chatId && isRedirectPathEmpty() && sessions && parseInt(sessions) === 1) {
      //     if (document.visibilityState === "hidden") {
      //           console.log("Tab is being closed or switched");
      //     } else if (document.visibilityState === "visible") {
      //       console.log("Tab is being reloaded");
      //     }
      //   }

      // if (left && Date.now() - left < 2000) {
      //   console.log("refreshed");
      // } else {
      //   console.log("closed");
      // }
    };

    // const pageHide = () => {
    //     const sessions = localStorage.getItem("sessions");
    //     if (chatId && isRedirectPathEmpty() && sessions && parseInt(sessions) === 1) {
    //       if (document.visibilityState === "hidden") {
    //           console.log("hide: Tab is being closed or switched");
    //             // console.log("document hidden", document.childNodes.length);     
          
    //       } else if (document.visibilityState === "visible") {
    //         // if (document.visibilityState === "visible") {
    //           console.log("hide: Tab is being reloaded");
    //           s();
    //         }
    //     }
    // };



    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);
    // window.addEventListener("pagehide", pageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      // window.removeEventListener("pagehide", pageHide);
    };
  }, [chatId]);
};

export default useReloadChatEndEffect;
