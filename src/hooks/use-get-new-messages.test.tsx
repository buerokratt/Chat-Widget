import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, act } from '@testing-library/react';
import chatReducer from '../slices/chat-slice';
import widgetReducer from '../slices/widget-slice';
import useGetNewMessages from './use-get-new-messages';

class MockEventSource {
  static instances: MockEventSource[] = [];
  onmessage: ((event: { data: string }) => void) | null = null;
  closed = false;
  url: string;
  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }
  close() {
    this.closed = true;
  }
  emit(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
}

const Probe = () => {
  useGetNewMessages();
  return null;
};

const setup = () => {
  MockEventSource.instances = [];
  (global as unknown as { EventSource: typeof MockEventSource }).EventSource = MockEventSource;
  const reducer = { chat: chatReducer, widget: widgetReducer };
  // Start from the real initial state: preloadedState replaces (not merges).
  const initialChat = configureStore({ reducer }).getState().chat;
  const store = configureStore({
    reducer,
    preloadedState: {
      chat: {
        ...initialChat,
        chatId: 'chat-1',
        lastReadMessageTimestamp: '2024-01-01T00:00:00',
      },
    },
  });
  render(
    <Provider store={store}>
      <Probe />
    </Provider>
  );
  const source = MockEventSource.instances[0];
  expect(source).toBeDefined();
  return { store, source: source as MockEventSource };
};

const streamingContent = (store: ReturnType<typeof setup>['store']) =>
  store.getState().chat.messages.find((m) => m.isStreaming)?.content;

describe('useGetNewMessages stream_start', () => {
  it('ignores a stream_start from a foreign channel', async () => {
    const { store, source } = setup();
    await act(async () => {
      source.emit({ type: 'stream_start', channelId: 'other-chat', streamId: 's-9' });
    });
    expect(store.getState().chat.isTypingStream).not.toBe(true);
    expect(streamingContent(store)).toBeUndefined();
  });

  it('keeps the in-progress stream when a duplicate stream_start arrives', async () => {
    const { store, source } = setup();
    await act(async () => {
      source.emit({ type: 'stream_start', channelId: 'chat-1', streamId: 's-1' });
    });
    await act(async () => {
      source.emit({ type: 'stream_chunk', channelId: 'chat-1', content: 'hello' });
    });
    expect(streamingContent(store)).toBe('hello');
    // Duplicate start for the same chat (e.g. retried request): must not reset.
    await act(async () => {
      source.emit({ type: 'stream_start', channelId: 'chat-1', streamId: 's-2' });
    });
    await act(async () => {
      source.emit({ type: 'stream_chunk', channelId: 'chat-1', content: 'world' });
    });
    expect(streamingContent(store)).toBe('helloworld');
    expect(store.getState().chat.isTypingStream).toBe(true);
  });
});
