import http2 from "./http2-service";
import { RUUTER_ENDPOINTS } from "../constants";

class WidgetService {
  getWidgetConfig(): Promise<any> {
    return http2.get(RUUTER_ENDPOINTS.GET_CHAT_CONFIG);
  }
}

export default new WidgetService();
