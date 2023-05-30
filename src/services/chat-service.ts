import http from './http-service';
import http2 from "./http2-service";
import { Message } from '../model/message-model';
import { Chat } from '../model/chat-model';
import { RUUTER_ENDPOINTS } from '../constants';
import { EndUserTechnicalData } from '../model/chat-ini-model';
import { EstimatedWaiting } from '../slices/chat-slice';
import { EmergencyNoticeResponse } from '../model/emergency-notice-response-model';

interface Document {
  _id: string;
}

class ChatService {
  init(message: Message, endUserTechnicalData: EndUserTechnicalData): Promise<Chat> {
    return http.post(RUUTER_ENDPOINTS.INIT_CHAT, { message, endUserTechnicalData });
  }

  getChatById(chatId: string): Promise<Chat> {
    return http.post(RUUTER_ENDPOINTS.GET_CHAT_BY_ID, { id: chatId });
  }

  sendNewMessage(message: Message): Promise<Document> {
    return http.post(RUUTER_ENDPOINTS.POST_MESSAGE, message);
  }

  getMessages(chatId: string): Promise<Message[]> {
    return http.post(RUUTER_ENDPOINTS.GET_MESSAGES_BY_CHAT_ID, { id: chatId });
  }

  sendMessageWithRating(message: Message): Promise<Document> {
    return http.post(RUUTER_ENDPOINTS.POST_NEW_RATING, message);
  }

  endChat(message: Message): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.END_CHAT, message);
  }

  getGreeting(): Promise<{ eng: string; est: string; isActive: boolean }> {
    return http.post(RUUTER_ENDPOINTS.GET_GREETING);
  }

  getEmergencyNotice(): Promise<EmergencyNoticeResponse> {
    return http2.get(RUUTER_ENDPOINTS.GET_EMERGENCY_NOTICE);
  }

  sendNpmRating({ chatId, npmRating }: { chatId: string; npmRating: number }): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.SEND_NPM_RATING, { chatId, feedbackRating: npmRating });
  }

  sendFeedbackMessage({ userFeedback, chatId }: { userFeedback: string; chatId: string }): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.SEND_FEEDBACK_MESSAGE, { chatId, feedbackText: userFeedback });
  }

  getEstimatedWaitingTime(): Promise<EstimatedWaiting> {
    return http.post(RUUTER_ENDPOINTS.GET_WAITING_TIME);
  }

  sendMessageWithNewEvent(message: Message): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.SEND_MESSAGE_WITH_NEW_EVENT, message);
  }

  removeChatForwardingValue(): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.REMOVE_CHAT_FORWARDING_VALUE);
  }

  generateForwardingRequest(): Promise<Chat[]> {
    return http.post(RUUTER_ENDPOINTS.GENERATE_FORWARDING_REQUEST);
  }

  generateDownloadChatRequest(): Promise<void> {
    return http.get(RUUTER_ENDPOINTS.DOWNLOAD_CHAT)
  }
}

export default new ChatService();
