import React from 'react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { act, fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import ChatKeyPad from './chat-keypad';
import { waitForRequest } from '../../mocks/server';
import ChatService from '../../services/chat-service';
import { CHAT_STATUS, RUUTER_ENDPOINTS } from '../../constants';
import chatReducer from '../../slices/chat-slice';
import KeypadErrorMessage from './keypad-error-message';

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

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('sends a preview immediately after input changes in an open agent chat', () => {
    jest.useFakeTimers();
    const sendMessagePreview = jest.spyOn(ChatService, 'sendMessagePreview').mockResolvedValue();
    const preloadedState = {
      chat: {
        chatId: '1',
        chatStatus: CHAT_STATUS.OPEN,
        customerSupportId: 'agent-1',
        messages: [],
        messageQueue: [],
      },
    };

    render(<ChatKeyPad />, { preloadedState });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'pasted text' } });

    expect(sendMessagePreview).toHaveBeenCalledWith(expect.objectContaining({
      chatId: '1',
      content: 'pasted text',
    }));

    act(() => { jest.advanceTimersByTime(500); });
    expect(sendMessagePreview).toHaveBeenCalledTimes(1);
  });

  it('resets preview state when the message is sent', () => {
    jest.useFakeTimers();
    const sendMessagePreview = jest.spyOn(ChatService, 'sendMessagePreview').mockResolvedValue();
    jest.spyOn(ChatService, 'sendNewMessage').mockResolvedValue({ _id: 'id' });
    const preloadedState = {
      chat: {
        chatId: '1',
        chatStatus: CHAT_STATUS.OPEN,
        customerSupportId: 'agent-1',
        messages: [],
        messageQueue: [],
      },
    };

    render(<ChatKeyPad />, { preloadedState });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'sent message' } });
    fireEvent.click(screen.getByRole('button', { name: 'keypad.button.label' }));

    fireEvent.change(input, { target: { value: 'new message' } });
    expect(sendMessagePreview).toHaveBeenCalledTimes(2);
  });

  it('does not send a preview when the input is cleared', () => {
    jest.useFakeTimers();
    const sendMessagePreview = jest.spyOn(ChatService, 'sendMessagePreview').mockResolvedValue();
    const preloadedState = {
      chat: {
        chatId: '1',
        chatStatus: CHAT_STATUS.OPEN,
        customerSupportId: 'agent-1',
        messages: [],
        messageQueue: [],
      },
    };

    render(<ChatKeyPad />, { preloadedState });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'typing' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(sendMessagePreview).toHaveBeenCalledTimes(1);
  });

  it('sends another preview after a longer pause in typing', () => {
    jest.useFakeTimers();
    const sendMessagePreview = jest.spyOn(ChatService, 'sendMessagePreview').mockResolvedValue();
    const preloadedState = {
      chat: {
        chatId: '1',
        chatStatus: CHAT_STATUS.OPEN,
        customerSupportId: 'agent-1',
        messages: [],
        messageQueue: [],
      },
    };

    render(<ChatKeyPad />, { preloadedState });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 't' } });
    act(() => { jest.advanceTimersByTime(200); });
    fireEvent.change(input, { target: { value: 'ty' } });
    act(() => { jest.advanceTimersByTime(200); });
    fireEvent.change(input, { target: { value: 'typ' } });
    act(() => { jest.advanceTimersByTime(100); });

    expect(sendMessagePreview).toHaveBeenCalledTimes(1);
    expect(sendMessagePreview).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'typ' }));

    act(() => { jest.advanceTimersByTime(500); });
    fireEvent.change(input, { target: { value: 'typi' } });
    expect(sendMessagePreview).toHaveBeenCalledTimes(2);
    expect(sendMessagePreview).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'typi' }));
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
