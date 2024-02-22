export const getFromSessionStorage = (key: string): string | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setToSessionStorage = (
  key: string,
  value: string | number | null
): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
