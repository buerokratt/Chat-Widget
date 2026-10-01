type EnvValue = Record<string, unknown>;

const ENV_CONFIG_FILE_NAME = "env-config.js";
const ENV_DEFAULTS_TIMEOUT_MS = 5000;

declare global {
  interface Window {
    __BYK_ENV_DEFAULTS__?: Promise<EnvValue | undefined>;
  }
}

const isPlainObject = (value: unknown): value is EnvValue =>
  Object.prototype.toString.call(value) === "[object Object]";

export const mergeEnv = (defaults: unknown, overrides: unknown): unknown => {
  if (overrides === undefined) return defaults;
  if (!isPlainObject(defaults) || !isPlainObject(overrides)) return overrides;

  const merged: EnvValue = { ...defaults };
  Object.keys(overrides).forEach((key) => {
    merged[key] = mergeEnv(defaults[key], overrides[key]);
  });
  return merged;
};

export const findMissingKeys = (defaults: unknown, overrides: unknown, prefix = ""): string[] => {
  if (!isPlainObject(defaults)) return [];
  if (!isPlainObject(overrides)) return overrides === undefined && prefix ? [prefix] : [];

  return Object.keys(defaults).flatMap((key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (overrides[key] === undefined) return [path];
    return findMissingKeys(defaults[key], overrides[key], path);
  });
};

const getBundleBaseUrl = (script: HTMLScriptElement | null): string | undefined =>
  process.env.NODE_ENV === "development"
    ? `${window.location.origin}${process.env.PUBLIC_URL ?? ""}/`
    : script?.src || undefined;

export const resolveEnvConfigUrl = (script: HTMLScriptElement | null): string | undefined => {
  const override = script?.getAttribute("data-env-config")?.trim();
  const base = getBundleBaseUrl(script);
  try {
    if (override) return new URL(override, base ?? window.location.href).href;
    if (base) return new URL(ENV_CONFIG_FILE_NAME, base).href;
  } catch {
  }
  return undefined;
};

const loadEnvDefaults = (url: string): Promise<EnvValue | undefined> =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    let defaults: EnvValue | undefined;
    let pageEnv: unknown = window._env_;
    let isTrapped = false;
    let isSettled = false;

    try {
      Object.defineProperty(window, "_env_", {
        configurable: true,
        enumerable: true,
        get: () => pageEnv,
        set: (value) => {
          if (document.currentScript === script) defaults = value;
          else pageEnv = value;
        },
      });
      isTrapped = true;
    } catch {
    }

    const settle = (value: EnvValue | undefined) => {
      if (isSettled) return;
      isSettled = true;
      resolve(value);
    };

    const finish = () => {
      if (isTrapped) {
        Object.defineProperty(window, "_env_", {
          configurable: true,
          enumerable: true,
          writable: true,
          value: pageEnv,
        });
      } else {
        defaults = window._env_ !== pageEnv ? (window._env_ as unknown as EnvValue) : undefined;
        (window as any)._env_ = pageEnv;
      }
      settle(isPlainObject(defaults) ? defaults : undefined);
    };

    script.onload = () => {
      finish();
      if (!isPlainObject(defaults)) {
        console.warn(`[Bürokratt widget] ${url} loaded but did not set window._env_ - no default config applied`);
      }
    };
    script.onerror = () => {
      console.warn(`[Bürokratt widget] Could not load default config from ${url}`);
      finish();
    };
    window.setTimeout(() => settle(undefined), ENV_DEFAULTS_TIMEOUT_MS);

    script.src = url;
    document.head.appendChild(script);
  });

export const applyEnvDefaults = async (script: HTMLScriptElement | null): Promise<void> => {
  const pageEnv = window._env_;
  const url = resolveEnvConfigUrl(script);
  if (!url) return;

  window.__BYK_ENV_DEFAULTS__ ??= loadEnvDefaults(url);
  const defaults = await window.__BYK_ENV_DEFAULTS__;
  if (!defaults) return;

  const missingKeys = findMissingKeys(defaults, pageEnv);
  if (missingKeys.length) {
    console.info(`[Bürokratt widget] Using default config from ${url} for: ${missingKeys.join(", ")}`);
  }

  window._env_ = mergeEnv(defaults, pageEnv) as Window["_env_"];
};
