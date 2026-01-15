import {CHAT_SESSIONS, LOCAL_STORAGE_TARA_LOGIN_REDIRECT} from "../constants";

export const isLastSession = (): boolean => {
  const currentState = JSON.parse(
    localStorage.getItem(CHAT_SESSIONS.SESSION_STATE_KEY) as string
  ) || { ids: [], count: 0 };
  return currentState.count <= 1;
};

export const isWentToTim = () : boolean => {
  return localStorage.getItem(LOCAL_STORAGE_TARA_LOGIN_REDIRECT) === 'true'
}

export const wasPageReloaded = () => {
  return window.performance
    .getEntriesByType("navigation")
    .map((nav) => (nav as PerformanceNavigationTiming).type)
    .includes("reload");
};

export const wasPageReloadedNavigate = () => {
  return window.performance.getEntriesByType("navigation").some((nav) => {
    const type = (nav as PerformanceNavigationTiming).type;
    return type === "reload" || type === "navigate";
  });
};

export const isChatAboutToBeTerminated = () => {
  const terminationTime = sessionStorage.getItem("terminationTime");

  console.log("terminationTime:", terminationTime);
  if (!terminationTime) return false;
  const terminationTimeout = window._env_.TERMINATION_TIMEOUT;
  const preTerminationTime = (terminationTimeout - 1) * 1000;

  console.log("terminationTimeout (s):", terminationTimeout);
  console.log("preTerminationTime (ms):", preTerminationTime);
  console.log("currentTime (ms):", Date.now());
  console.log("terminationTime parsed (ms):", parseInt(terminationTime));
  console.log("is chat about to be terminated?", preTerminationTime > Date.now() - parseInt(terminationTime));
  return preTerminationTime > Date.now() - parseInt(terminationTime);
};

export const isMobileWidth = () => {
  return window.innerWidth < 480;
};

export const isIphone = () => {
  return /iPhone|iPad|iPod/.test(window.navigator.userAgent) && isMobileWidth();
};

export const isMobile = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(window.navigator.userAgent) &&
    isMobileWidth()
  );
};
