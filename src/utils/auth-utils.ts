import { LOCAL_STORAGE_TARA_LOGIN_REDIRECT } from "../constants";
import widgetService from "../services/widget-service";
import {getFromSessionStorage, removeFromSessionStorage, setToSessionStorage} from "./session-storage-utils";

export function redirectToTim() {
  saveCurrentBrowserPath();
  window.location.assign(window._env_.TIM_AUTHENTICATION_URL);
}

export function redirectIfComeBackFromTim(callback: any) {
  const redirectPath = getRedirectPath();
  if (redirectPath) {
    setTimeout(async () => {
      if (window.location.href !== redirectPath) {
        const allowedURLPattern = /(https?:\/\/)?([\da-z.-]+)\.([a-z]{2,6})([/\w.-]+)+\/?/;
        if (allowedURLPattern.test(redirectPath)) {
           window.location.replace(redirectPath);
        }
      }
      removeRedirectPath();
      widgetService.authenticateUser();
      callback();
    }, 500);
  }
}

export function isRedirectPathEmpty() {
  return !isRedirectPathSet();
}

function saveCurrentBrowserPath() {
  setToSessionStorage(LOCAL_STORAGE_TARA_LOGIN_REDIRECT, window.location.href);
}

function getRedirectPath() {
  return getFromSessionStorage(LOCAL_STORAGE_TARA_LOGIN_REDIRECT);
}

function removeRedirectPath() {
  removeFromSessionStorage(LOCAL_STORAGE_TARA_LOGIN_REDIRECT);
}

function isRedirectPathSet() {
  return !!getRedirectPath();
}
