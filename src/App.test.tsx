import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Settings } from 'luxon';
import { act } from 'react-dom/test-utils';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from './utils/test-utils';
import App from './App';
import chatReducer from './slices/chat-slice';
import widgetReducer from './slices/widget-slice';
import authenticationReducer from './slices/authentication-slice';
import { Chat } from './model/chat-model';
import ChatService from './services/chat-service';
import ChatComponent from './components/chat/chat';
import { initialChatState } from './test-initial-states';
import { SESSION_STORAGE_CHAT_ID_KEY } from './constants';
import { setToLocalStorage } from './utils/local-storage-utils';

jest.mock('./services/sse-service', () => ({
  __esModule: true,
  default: () => ({
    onMessage: () => null,
  }),
}));

// App visibility tests isolate polling/authentication; transport contracts are tested separately.
jest.mock('./hooks/use-authentication', () => () => undefined);
jest.mock('./hooks/use-get-chat', () => () => undefined);
jest.mock('./hooks/use-get-new-messages', () => () => undefined);
jest.mock('./hooks/use-get-emergency-notice', () => () => undefined);
jest.mock('./hooks/use-name-title-visibility', () => () => undefined);

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      widget: widgetReducer,
      authentication: authenticationReducer,
    },
    preloadedState: {
      chat: { ...initialChatState, emergencyNotice: { start: '', end: '', text: '' } as any },
      widget: { ...widgetReducer(undefined, { type: 'init' }), burokrattOnlineStatus: true, widgetConfig: { ...widgetReducer(undefined, { type: 'init' }).widgetConfig, isLoaded: true } },
    },
  });
}

describe('App component', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });
  beforeEach(() => {
    Settings.now = () => new Date(2022, 0, 18, 12).valueOf();
    window._env_.OFFICE_HOURS.ENABLED = true;
    emptyStore = createEmptyStore();
  });

  it('renders App and Profile button', async () => {
    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(await screen.findByRole('button')).toBeInTheDocument();
  });

  it('renders Chat on button click', async () => {
    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    fireEvent.click(await screen.findByRole('button'));
    expect(await screen.findByRole('textbox', { name: /sisesta tekst/i })).toBeInTheDocument();
  });

  it('hides widget when not in office hours', () => {
    Settings.now = () => new Date(2022, 0, 18, 2).valueOf();

    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('hides widget when no session exists and office hours end', () => {
    jest.useFakeTimers();
    Settings.now = () => new Date(2022, 0, 18, 12).valueOf();

    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(screen.getAllByRole('button')).toBeTruthy();
    act(() => {
      Settings.now = () => new Date(2022, 0, 18, 17).valueOf();
      jest.advanceTimersByTime(60000);
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not hides widget when session exists and office hours end', () => {
    jest.useFakeTimers();
    Settings.now = () => new Date(2022, 0, 18, 12).valueOf();
    setToLocalStorage(SESSION_STORAGE_CHAT_ID_KEY, '1');

    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(screen.getAllByRole('button')).toBeTruthy();
    act(() => {
      Settings.now = () => new Date(2022, 0, 18, 17).valueOf();
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getAllByRole('button')).toBeTruthy();
  });

  it('should init chat if chatId is missing', async () => {
    const initResponse: Chat = { customerSupportId: '1', id: 'string', status: 'OPEN' };
    ChatService.init = jest.fn(() => Promise.resolve(initResponse));
    const store = createEmptyStore();

    render(
      <Provider store={store}>
        <ChatComponent />
      </Provider>,
    );

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /sisesta tekst/i,
      }),
      { target: { value: 'longCharMessage' } },
    );
    fireEvent.click(
      screen.getByRole('img', {
        name: /send message icon/i,
      }),
    );
    await waitFor(() => expect(ChatService.init).toHaveBeenCalled());
  });
});
