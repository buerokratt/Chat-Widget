import { DateTime } from 'luxon';
import { Message } from '../model/message-model';
import { CHAT_EVENTS, SESSION_STORAGE_CHAT_ID_KEY } from '../constants';
import { setToSessionStorage } from './session-storage-utils';

export const findMatchingMessageFromMessageList = (messageToMatch: Message, messages: Message[]): Message | undefined =>
  messages.find(
    (message) =>
      message.authorTimestamp?.trim() !== '' &&
      DateTime.fromISO(message.authorTimestamp).toString() === DateTime.fromISO(messageToMatch.authorTimestamp).toString() &&
      message.authorRole === messageToMatch.authorRole,
  );

export const isStateChangingEventMessage = (msg: Message): boolean =>
  msg.event === CHAT_EVENTS.GREETING ||
  msg.event === CHAT_EVENTS.ASK_PERMISSION_IGNORED ||
  (msg.event === CHAT_EVENTS.CONTACT_INFORMATION && msg.content?.length === 0) ||
  msg.event === CHAT_EVENTS.ANSWERED ||
  msg.event === CHAT_EVENTS.TERMINATED;

export const clearStateVariablesFromSessionStorage = (): void => {
  setToSessionStorage(SESSION_STORAGE_CHAT_ID_KEY, null);
  setToSessionStorage('newMessagesAmount', 0);
};
