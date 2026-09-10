import { namespacedKey } from "./widget-instance-utils";

export const getFromLocalStorage = (key: string, initialValue: any = null): any => {
  try {
    const item = localStorage.getItem(namespacedKey(key));
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
};

export const setToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(namespacedKey(key), JSON.stringify(value));
  } catch { }
};
