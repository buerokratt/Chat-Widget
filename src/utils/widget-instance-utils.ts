const currentScript = document.currentScript as HTMLScriptElement | null;

export const WIDGET_INSTANCE_ID =
  currentScript?.getAttribute("data-instance-id")?.trim() || "";

export const WIDGET_TARGET_ELEMENT_ID =
  currentScript?.getAttribute("data-target")?.trim() || "byk-va";

export const namespacedKey = (key: string): string =>
  WIDGET_INSTANCE_ID ? `${key}::${WIDGET_INSTANCE_ID}` : key;
