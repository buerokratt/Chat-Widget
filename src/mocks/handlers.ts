import { rest } from 'msw';

import messagesForChatInTimerange from './responses/messages-for-chat-in-timerange.json';
import messagesByChatId from './responses/messages-by-chat-id.json';
import initChat from './responses/init-chat.json';
import chatById from './responses/chat-by-Id.json';
import endChat from './responses/end-chat.json';
import getWaitingTime from './responses/get-waiting-time.json';
import postMessage from './responses/post-message.json';
import { RUUTER_ENDPOINTS } from '../constants';

const ruuterUrl = 'http://localhost:3003';

const handlers = [
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.INIT_CHAT}`, (_req, res, ctx) => res(ctx.json(initChat))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.POST_MESSAGE}`, (_req, res, ctx) => res(ctx.json(postMessage))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_MESSAGES_BY_CHAT_ID}`, (_req, res, ctx) => res(ctx.json(messagesByChatId))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.END_CHAT}`, (_req, res, ctx) => res(ctx.json(endChat))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_CHAT_BY_ID}`, (_req, res, ctx) => res(ctx.json(chatById))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_NEW_MESSAGES}`, (_req, res, ctx) => res(ctx.json(messagesForChatInTimerange))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_WAITING_TIME}`, (_req, res, ctx) => res(ctx.json(getWaitingTime))),
  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.DOWNLOAD_CHAT}`, async (_req, res, ctx) => {
    // TODO fix with correct mocking
    const url = 'https://cors-anywhere.herokuapp.com/https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        },
    };
    const pdfFile = await fetch(url, requestOptions)
    .then((res) =>
    res.arrayBuffer(),)

  return res(
    ctx.set('Content-Length', pdfFile.byteLength.toString()),
    ctx.set('Content-Type', 'application/pdf'),
    ctx.body(pdfFile),
  )
    
  }),
  rest.get(`${ruuterUrl}${RUUTER_ENDPOINTS.BUROKRATT_ONLINE_STATUS}`, (_req, res, ctx) => {
    return res(ctx.status(200));
    // return res(ctx.status(503));
  }),
];

export default handlers;
