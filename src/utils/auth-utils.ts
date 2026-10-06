import { LOCAL_STORAGE_TARA_LOGIN_REDIRECT } from "../constants";
import widgetService from "../services/widget-service";
import { namespacedKey } from "./widget-instance-utils";

export function redirectToTim() {
  localStorage.setItem(namespacedKey(LOCAL_STORAGE_TARA_LOGIN_REDIRECT), 'true');
  window.location.assign(`${window._env_.TIM_AUTHENTICATION_URL}?callback_url=${encodeURIComponent(window.location.href)}`);
}

export async function redirectIfComeBackFromTim(callback: any) {
  const taraLoginRedirect = localStorage.getItem(namespacedKey(LOCAL_STORAGE_TARA_LOGIN_REDIRECT));
  if (taraLoginRedirect === 'true') {
    localStorage.removeItem(namespacedKey(LOCAL_STORAGE_TARA_LOGIN_REDIRECT));
    await widgetService.authenticateUser();
    callback();
  }
}
