import { rest } from 'msw';

import messagesForChatInTimerange from './responses/messages-for-chat-in-timerange.json';
import messagesByChatId from './responses/messages-by-chat-id.json';
import initChat from './responses/init-chat.json';
import chatById from './responses/chat-by-Id.json';
import endChat from './responses/end-chat.json';
import postMessage from './responses/post-message.json';
import { RUUTER_ENDPOINTS } from '../constants';

const ruuterUrl = 'http://localhost:8086/backoffice';

const handlers = [
  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_WIDGET_CONFIG}`, (_req, res, ctx) => res(ctx.json({ response: {
    isBurokrattActive: 'true', isWidgetActive: 'false', instantlyOpenChatWidget: 'false',
    feedbackActive: 'false', feedbackNoticeActive: 'false', showIdleWarning: 'false', showAutoCloseText: 'false',
  } }))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.INIT_CHAT}`, (_req, res, ctx) => res(ctx.json(initChat))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.POST_MESSAGE}`, (_req, res, ctx) => res(ctx.json({ response: 'Message Sent Successfully' }))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_MESSAGES_BY_CHAT_ID}`, (_req, res, ctx) => res(ctx.json(messagesByChatId))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.END_CHAT}`, (_req, res, ctx) => res(ctx.json(endChat))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_CHAT_BY_ID}`, (_req, res, ctx) => res(ctx.json(chatById))),
  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_NEW_MESSAGES}`, (_req, res, ctx) => res(ctx.json(messagesForChatInTimerange))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.DOWNLOAD_CHAT}`, (_req, res, ctx) => res(
    ctx.set('Content-Type', 'application/pdf'), ctx.body('%PDF-1.4\n%%EOF')
  )),

  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.SEND_ATTACHMENT}`, (_req, res, ctx) => res(ctx.status(200))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.SEND_CONTACT_INFO}`, (req, res, ctx) => {

    const success = {
      "response": "Updated 123 with example@example.com and +1 404."
    }
    
    return res(
      ctx.status(200),
      ctx.json(success));
  }),

  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.CUSTOM_JWT_EXTEND}`, (_req, res, ctx) => res(ctx.json({ response: 'test-only-renewal' }))),
  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_EMERGENCY_NOTICE}`, (_req, res, ctx) => res(ctx.json({ response: { emergencyNoticeStartISO: '', emergencyNoticeEndISO: '', emergencyNoticeText: '' } }))),
  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_GREETING}`, (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      "response": { "est": "Tere tulemast! Kuidas ma saan teid aidata?", "eng": "Welcome", "isActive": false }
    })
  )),
  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.CUSTOM_JWT_USERINFO}`, (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json({ response: {
      jwtExpirationTimestamp: '2099-10-10T10:10:10.000Z', firstName: 'Test', lastName: 'User', personalCode: '11111',
    } })
  )),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_WAITING_TIME}`, (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      "durationInSeconds": "600",
      "positionInUnassignedChats": "4"
    })
  ))
];

export default handlers;
