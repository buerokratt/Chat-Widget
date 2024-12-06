export const getFromSessionStorage = (key: string, initialValue: any = null): any => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
};

export const setToSessionStorage = (key: string, value: any) : void => {
    try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch { }
};