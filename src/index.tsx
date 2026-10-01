import { WIDGET_SCRIPT } from "./utils/widget-instance-utils";
import { applyEnvDefaults } from "./utils/env-defaults";

applyEnvDefaults(WIDGET_SCRIPT)
  .catch((error) => console.error("[Bürokratt widget] Failed to apply default config", error))
  .then(() => import("./main"));
