import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { handleStateChangingEventMessages, setShowAskToForwardToCsaForm } from '../slices/chat-slice';
import { initialChatState } from '../test-initial-states';
import { CHAT_EVENTS } from '../constants';
import service from '../services/chat-service';
import sse from '../services/sse-service';
import useGetNewMessages from './use-get-new-messages';

jest.mock('../services/sse-service', () => ({ __esModule: true, default: jest.fn(() => ({ close: jest.fn() })) }));
jest.mock('../services/chat-service');
const fetchMessages = service.getNewMessages as jest.Mock;
const stream = sse as jest.Mock;
function mount() {
  const store = configureStore({ reducer: { chat: reducer }, preloadedState: { chat: { ...initialChatState, chatId: 'chat-a', lastReadMessageTimestamp: '2026-10-16T08:00:00.000Z' } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
  const hook = renderHook(useGetNewMessages, { wrapper });
  expect(hook.result.error).toBeUndefined();
  const [, message, open] = stream.mock.calls[0];
  return { ...hook, store, message, open };
}
beforeEach(() => { jest.clearAllMocks(); fetchMessages.mockResolvedValue([]); stream.mockImplementation(() => { const originalClose = jest.fn(); return { close: originalClose, originalClose }; }); });
it('catches up on open/reconnect and advances by maximum updated time rather than array order', async () => {
  fetchMessages.mockResolvedValueOnce([
    { id: 'new', chatId: 'chat-a', content: 'new', authorTimestamp: '2026-10-16T09:00:00.000Z', created: '2026-10-16T08:00:00.000Z', updated: '2026-10-16T10:00:00.000Z' },
    { id: 'old', chatId: 'chat-a', content: 'old', authorTimestamp: '2026-10-16T08:00:00.000Z', created: '2026-10-16T08:00:00.000Z', updated: '2026-10-16T09:00:00.000Z' },
  ]);
  const hook = mount();
  await act(async () => { await hook.open(); });
  expect(fetchMessages).toHaveBeenNthCalledWith(1, '1970-01-01T00:00:00.000');
  await act(async () => { await hook.message({ type: 'message' }); });
  expect(fetchMessages).toHaveBeenNthCalledWith(2, '2026-10-16T10:00:00.000Z');
  await act(async () => { await hook.open(); });
  expect(fetchMessages).toHaveBeenCalledTimes(3);
  expect(hook.store.getState().chat.messages.map(m => m.id)).toEqual(['new', 'old']);
});
it('serializes overlapping notifications and fetches again when a notification arrives in flight', async () => {
  let complete!: (messages: any[]) => void;
  fetchMessages.mockImplementationOnce(() => new Promise(resolve => { complete = resolve; }));
  const hook = mount();
  let opening!: Promise<void>;
  act(() => { opening = hook.open(); });
  await act(async () => { await hook.message({ type: 'message' }); });
  expect(fetchMessages).toHaveBeenCalledTimes(1);
  await act(async () => { complete([]); await opening; });
  expect(fetchMessages).toHaveBeenCalledTimes(2);
});
it('closes stream and ignores a completed fetch after unmount', async () => {
  let complete!: (messages: any[]) => void;
  fetchMessages.mockImplementationOnce(() => new Promise(resolve => { complete = resolve; }));
  const hook = mount();
  let opening!: Promise<void>;
  act(() => { opening = hook.open(); });
  const close = stream.mock.results[0].value.originalClose;
  hook.unmount();
  await act(async () => { complete([{ id: 'late', content: 'late', authorTimestamp: '2026-10-16T11:00:00Z' }]); await opening; });
  expect(close).toHaveBeenCalledTimes(1);
  expect(hook.store.getState().chat.messages).toEqual([]);
});
it('does not reopen a handled forwarding prompt when catch-up repeats an event', () => {
  const event = { id: 'forward-a', chatId: 'chat-a', event: CHAT_EVENTS.ASK_TO_FORWARD_TO_CSA, content: 'Forward?', authorTimestamp: '2026-10-16T08:00:00Z' };
  const shown = reducer(initialChatState, handleStateChangingEventMessages([event]));
  expect(shown.showAskToForwardToCsaForm).toBe(true);
  const dismissed = reducer(shown, setShowAskToForwardToCsaForm(false));
  expect(dismissed.handledForwardToCsaMessageIds).toEqual(['forward-a']);
  expect(reducer(dismissed, handleStateChangingEventMessages([event])).showAskToForwardToCsaForm).toBe(false);
});
