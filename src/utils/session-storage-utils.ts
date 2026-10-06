import { namespacedKey } from "./widget-instance-utils";

export const getFromSessionStorage = (key: string): string | null => {
  const item = sessionStorage.getItem(namespacedKey(key));
  return item ? JSON.parse(item) : null;
};

export const setToSessionStorage = (key: string, value: string | number | null): void => {
  sessionStorage.setItem(namespacedKey(key), JSON.stringify(value));
};
