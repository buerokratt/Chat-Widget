// src/global.d.ts
declare global {
  interface Window {
    _env_: {
      RUUTER_API_URL: string;
      NOTIFICATION_NODE_URL: string;
      ENVIRONMENT: "development" | "production";
      TIM_AUTHENTICATION_URL: string;
      ORGANIZATION_NAME: string;
      TERMS_AND_CONDITIONS_LINK: string;
      OFFICE_HOURS: {
        ENABLED: boolean;
        TIMEZONE: string;
        BEGIN: number;
        END: number;
        DAYS: number[];
      };
      ENABLE_HIDDEN_FEATURES: string;
      IFRAME_TARGET_OIRGIN: string;
    };
  }
}

export {};
