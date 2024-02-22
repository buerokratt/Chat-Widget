import { useEffect } from "react";
import {
  getFromSessionStorage,
  setToSessionStorage,
} from "../utils/session-storage-utils";

const TEMP = "current-timestamp-temp";
const TRIGGER = "current-timestamp";

const useMemoryStorage = (
  storageKey: string,
  data: string | null,
  callback: (data: any) => any
) => {
  useEffect(() => {
    window.localStorage.setItem(TRIGGER, Date.now().toString());

    const storageHandler = ({ key, newValue }: StorageEvent) => {
      if (key === TRIGGER) {
        const storedData = getFromSessionStorage(storageKey);

        if (storedData != null) {
          window.localStorage.setItem(TEMP, storedData);
        }

        window.localStorage.removeItem(TEMP);
      } else if (key === TEMP && newValue != null) {
        setToSessionStorage(storageKey, newValue);
        callback(newValue);
      }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("storage", storageHandler);
    };
  }, [storageKey, callback]);

  useEffect(() => {
    if (data != null) {
      window.localStorage.setItem(TEMP, data);
      window.localStorage.removeItem(TEMP);
    }
  }, [data]);
};

export { useMemoryStorage, useMemoryStorage as default };
