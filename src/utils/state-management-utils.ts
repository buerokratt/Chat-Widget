import { DateTime } from 'luxon';
import { Message } from '../model/message-model';
import {
  CHAT_EVENTS,
  CHAT_WINDOW_HEIGHT,
  CHAT_WINDOW_WIDTH,
  LOCAL_STORAGE_CHAT_DIMENSIONS_KEY,
  SESSION_STORAGE_CHAT_ID_KEY,
  TERMINATE_STATUS
} from '../constants';
import { setToSessionStorage } from './session-storage-utils';
import { getFromLocalStorage } from './local-storage-utils';

export const findMatchingMessageFromMessageList = (messageToMatch: Message, messages: Message[]): Message | undefined =>
  messages.find(
    (message) =>
      message.authorTimestamp?.trim() !== '' &&
      DateTime.fromISO(message.authorTimestamp).toString() === DateTime.fromISO(messageToMatch.authorTimestamp).toString() &&
      message.authorRole === messageToMatch.authorRole,
  );

export const isStateChangingEventMessage = (msg: Message): boolean => {
  if(!msg.event)
    return false;

  const whitelist = [
    CHAT_EVENTS.GREETING,
    CHAT_EVENTS.ASK_PERMISSION_IGNORED,
    CHAT_EVENTS.ANSWERED,
    CHAT_EVENTS.TERMINATED,
    CHAT_EVENTS.UNAVAILABLE_ORGANIZATION,
    CHAT_EVENTS.UNAVAILABLE_CSAS,
    CHAT_EVENTS.UNAVAILABLE_HOLIDAY,
    TERMINATE_STATUS.CLIENT_LEFT_WITH_ACCEPTED,
    TERMINATE_STATUS.CLIENT_LEFT_WITH_NO_RESOLUTION ,
    TERMINATE_STATUS.CLIENT_LEFT_FOR_UNKNOWN_REASONS ,
    TERMINATE_STATUS.ACCEPTED,
    TERMINATE_STATUS.HATE_SPEECH ,
    TERMINATE_STATUS.OTHER ,
    TERMINATE_STATUS.RESPONSE_SENT_TO_CLIENT_EMAIL,
  ];

  const event = msg.event as CHAT_EVENTS | TERMINATE_STATUS;
  return whitelist.includes(event) || (event === CHAT_EVENTS.CONTACT_INFORMATION && msg.content?.length === 0);
}

export const clearStateVariablesFromSessionStorage = (): void => {
  setToSessionStorage(SESSION_STORAGE_CHAT_ID_KEY, null);
  setToSessionStorage('newMessagesAmount', 0);
};

export const getInitialChatDimensions = (): { width: number, height: number } => {
  const storedDimensions = getFromLocalStorage(LOCAL_STORAGE_CHAT_DIMENSIONS_KEY)

  const isValiedValue = !isNaN(storedDimensions?.width) && !isNaN(storedDimensions?.height);

  return isValiedValue
    ? storedDimensions
    : {
      width: CHAT_WINDOW_WIDTH,
      height: CHAT_WINDOW_HEIGHT
    };
}
