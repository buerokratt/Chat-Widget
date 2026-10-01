import { applyEnvDefaults, findMissingKeys, mergeEnv, resolveEnvConfigUrl } from "./env-defaults";

const devopsEnv = {
  RUUTER_API_URL: "https://ruuter.devops",
  FALLBACK_LANGUAGE: "et",
  OFFICE_HOURS: { TIMEZONE: "Europe/Tallinn", BEGIN: 8, END: 17, DAYS: [1, 2, 3, 4, 5] },
};

describe("mergeEnv", () => {
  it("keeps every value the page sets and fills in the rest from the defaults", () => {
    expect(mergeEnv(devopsEnv, { RUUTER_API_URL: "https://ruuter.client" })).toEqual({
      ...devopsEnv,
      RUUTER_API_URL: "https://ruuter.client",
    });
  });

  it("merges nested objects key by key and replaces arrays", () => {
    expect(mergeEnv(devopsEnv, { OFFICE_HOURS: { BEGIN: 0, DAYS: [6] } })).toEqual({
      ...devopsEnv,
      OFFICE_HOURS: { TIMEZONE: "Europe/Tallinn", BEGIN: 0, END: 17, DAYS: [6] },
    });
  });

  it("treats null as an explicit value", () => {
    expect(mergeEnv(devopsEnv, { OFFICE_HOURS: null })).toEqual({ ...devopsEnv, OFFICE_HOURS: null });
  });

  it("falls back to the defaults when the page sets no config", () => {
    expect(mergeEnv(devopsEnv, undefined)).toEqual(devopsEnv);
  });
});

describe("findMissingKeys", () => {
  it("lists top-level and nested keys the page left out", () => {
    expect(findMissingKeys(devopsEnv, { RUUTER_API_URL: "x", OFFICE_HOURS: { BEGIN: 0, END: 24 } })).toEqual([
      "FALLBACK_LANGUAGE",
      "OFFICE_HOURS.TIMEZONE",
      "OFFICE_HOURS.DAYS",
    ]);
  });
});

describe("resolveEnvConfigUrl", () => {
  const scriptWith = (attributes: Record<string, string>) => {
    const script = document.createElement("script");
    Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
    return script;
  };

  it("points at env-config.js next to the widget bundle", () => {
    expect(resolveEnvConfigUrl(scriptWith({ src: "https://widget.devops/widget/widget_bundle.js" }))).toBe(
      "https://widget.devops/widget/env-config.js"
    );
  });

  it("prefers the data-env-config attribute", () => {
    const script = scriptWith({
      src: "https://cdn.devops/widget_bundle.js",
      "data-env-config": "https://widget.devops/config.js",
    });
    expect(resolveEnvConfigUrl(script)).toBe("https://widget.devops/config.js");
  });

  it("points at the public root on the dev server, whose bundle lives in /static/js/", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = "development";
    try {
      expect(resolveEnvConfigUrl(scriptWith({ src: `${window.location.origin}/static/js/bundle.js` }))).toBe(
        `${window.location.origin}/env-config.js`
      );
    } finally {
      (process.env as any).NODE_ENV = originalNodeEnv;
    }
  });

  it("returns nothing without a script element", () => {
    expect(resolveEnvConfigUrl(null)).toBeUndefined();
  });
});

describe("applyEnvDefaults", () => {
  const originalEnv = window._env_;
  const widgetScript = document.createElement("script");
  widgetScript.src = "https://widget.devops/widget_bundle.js";

  const injectedScript = () =>
    document.head.querySelector('script[src="https://widget.devops/env-config.js"]') as HTMLScriptElement;

  const runEnvConfig = (script: HTMLScriptElement, env: unknown) => {
    const currentScript = jest.spyOn(document, "currentScript", "get").mockReturnValue(script);
    (window as any)._env_ = env;
    currentScript.mockRestore();
    script.dispatchEvent(new Event("load"));
  };

  afterEach(() => {
    delete window.__BYK_ENV_DEFAULTS__;
    document.head.innerHTML = "";
    window._env_ = originalEnv;
    jest.restoreAllMocks();
  });

  it("fills the page's missing keys without env-config.js overwriting the page config", async () => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    (window as any)._env_ = { RUUTER_API_URL: "https://ruuter.client" };

    const applied = applyEnvDefaults(widgetScript);
    runEnvConfig(injectedScript(), devopsEnv);
    await applied;

    expect(window._env_).toEqual({ ...devopsEnv, RUUTER_API_URL: "https://ruuter.client" });
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining("FALLBACK_LANGUAGE, OFFICE_HOURS"));
  });

  it("keeps the page config as it is when env-config.js fails to load", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const pageEnv = { RUUTER_API_URL: "https://ruuter.client" };
    (window as any)._env_ = pageEnv;

    const applied = applyEnvDefaults(widgetScript);
    injectedScript().dispatchEvent(new Event("error"));
    await applied;

    expect(window._env_).toBe(pageEnv);
  });

  it("loads the defaults once for every widget instance on the page", async () => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    (window as any)._env_ = { FALLBACK_LANGUAGE: "en" };

    const first = applyEnvDefaults(widgetScript);
    const second = applyEnvDefaults(widgetScript);
    runEnvConfig(injectedScript(), devopsEnv);
    await Promise.all([first, second]);

    expect(document.head.querySelectorAll("script")).toHaveLength(1);
    expect(window._env_).toEqual({ ...devopsEnv, FALLBACK_LANGUAGE: "en" });
  });
});
