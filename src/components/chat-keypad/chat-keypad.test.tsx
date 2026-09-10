import React from 'react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import ChatKeyPad from './chat-keypad';
import { waitForRequest } from '../../mocks/server';
import { CHAT_STATUS, RUUTER_ENDPOINTS } from '../../constants';
import chatReducer from '../../slices/chat-slice';
import widgetReducer from '../../slices/widget-slice';
import authenticationReducer from '../../slices/authentication-slice';
import { initialChatState } from '../../test-initial-states';
import KeypadErrorMessage from './keypad-error-message';

// sanitize-html (via htmlparser2) ships ESM that react-scripts jest does not
// transform; the counter behavior under test does not depend on sanitizing.
jest.mock('sanitize-html', () => ({
  __esModule: true,
  default: (value: string) => value,
}));

let store: EnhancedStore;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

function createTestStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
  });
}

describe('Keypad', () => {
  beforeEach(() => {
    store = createTestStore();
  });

  it('clears input after pressing enter', () => {
    render(<ChatKeyPad />);
    const input = screen.getByRole('button') as HTMLInputElement;
    userEvent.type(input, 'Hello!{enter}');
    expect(input.value).toBeFalsy();
  });

  it('sends new message request when chatId is present', async () => {
    const preloadedState = { chat: { chatId: '1', messages: [], messageQueue: [] } };
    const message = 'I need help!';
    render(<ChatKeyPad />, { preloadedState });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const pendingSendNewMessage = waitForRequest('POST', RUUTER_ENDPOINTS.POST_MESSAGE);
    userEvent.type(input, `${message}{enter}`);
    const request = await pendingSendNewMessage;
    expect(request.body.content).toBe(message);
  });

  it('keypad error message returns empty string no children', () => {
    const testMessage = '';
    const { container } = render(
      <Provider store={store}>
        <KeypadErrorMessage>{testMessage}</KeypadErrorMessage>
      </Provider>,
    );
    expect(container.childNodes.length).toEqual(0);
  });

  it('keypad error message value when given children', () => {
    const testMessage = 'Error message';
    render(
      <Provider store={store}>
        <KeypadErrorMessage>{testMessage}</KeypadErrorMessage>
      </Provider>,
    );
    screen.getByText(testMessage);
  });
});

describe('Keypad feedback char counter', () => {
  function createEndedChatStore() {
    return configureStore({
      reducer: {
        chat: chatReducer,
        widget: widgetReducer,
        authentication: authenticationReducer,
      },
      preloadedState: {
        chat: { ...initialChatState, chatId: '1', chatStatus: CHAT_STATUS.ENDED },
      },
    });
  }

  it('uses the 500-char feedback limit once the chat has ended', () => {
    const endedStore = createEndedChatStore();
    rtlRender(
      <Provider store={endedStore}>
        <ChatKeyPad />
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText('keypad.input.placeholder'), {
      target: { value: 'a'.repeat(600) },
    });

    // 600 chars is over the 500-char feedback limit but well under the
    // 3000-char message limit, so the counter must show the feedback limit.
    screen.getByText('600/500');
  });
});
