import { LOCAL_STORAGE_TARA_LOGIN_REDIRECT } from "../constants";
import widgetService from "../services/widget-service";

export function redirectToTim() {
  saveCurrentBrowserPath();
  window.location.assign(window._env_.TIM_AUTHENTICATION_URL);
}

export function redirectIfComeBackFromTim(callback: any) {
  const redirectPath = getRedirectPath();
  if (redirectPath) {
    setTimeout(async () => {
      if (window.location.href !== redirectPath) {
        const sanitizedRedirectPath = sanitizeURL(redirectPath);
        window.location.replace(sanitizedRedirectPath);
      }
      removeRedirectPath();
      widgetService.authenticateUser();
      callback();
    }, 500);
  }
}

function sanitizeURL(url: string): string {
  // Add your sanitization logic here
  // For example, you can use a regular expression to validate the URL format
  // and remove any potentially malicious characters or parameters
  return url;
}

export function isRedirectPathEmpty() {
  return !isRedirectPathSet();
}

function saveCurrentBrowserPath() {
  localStorage.setItem(LOCAL_STORAGE_TARA_LOGIN_REDIRECT, window.location.href);
}

function getRedirectPath() {
  return localStorage.getItem(LOCAL_STORAGE_TARA_LOGIN_REDIRECT);
}

function removeRedirectPath() {
  localStorage.removeItem(LOCAL_STORAGE_TARA_LOGIN_REDIRECT);
}

function isRedirectPathSet() {
  return !!getRedirectPath();
}
