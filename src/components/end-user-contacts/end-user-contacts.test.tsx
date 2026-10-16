import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import chatReducer from '../../slices/chat-slice';
import widgetReducer from '../../slices/widget-slice';
import EndUserContacts from './end-user-contacts';
import WidgetService from '../../services/widget-service';
import ChatService from '../../services/chat-service';
import { initialChatState } from '../../test-initial-states';

let store: EnhancedStore;

describe('end user contact form', () => {
  afterEach(() => jest.restoreAllMocks());
  beforeEach(() => {
    store = configureStore({
      reducer: {
        chat: chatReducer,
        widget: widgetReducer,
      },
      preloadedState: {
        chat: { ...initialChatState, chatId: '1' },
      },
    });
  });

  it('should render', () => {
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
  });

  it('should send http when only email is given', async () => {
    const placeholderEmail = 'nimi@email.ee';
    jest.spyOn(WidgetService, 'sendContactInfo').mockResolvedValue({} as any);
    jest.spyOn(ChatService, 'sendMessageWithNewEvent').mockResolvedValue();
    jest.spyOn(ChatService, 'sendMessagePreview').mockResolvedValue();
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText(placeholderEmail), { target: { value: placeholderEmail } });
    fireEvent.click(screen.getByRole('button', { name: /^Kinnita$/i }));
    await waitFor(() => expect(WidgetService.sendContactInfo).toHaveBeenCalledWith('1', 'nimi@email.ee', ''));
    await waitFor(() => expect(ChatService.sendMessageWithNewEvent).toHaveBeenCalled());
  });

  it('should send http when only phone nr is given', async () => {
    jest.spyOn(WidgetService, 'sendContactInfo').mockResolvedValue({} as any);
    jest.spyOn(ChatService, 'sendMessageWithNewEvent').mockResolvedValue();
    jest.spyOn(ChatService, 'sendMessagePreview').mockResolvedValue();
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText('+372 123 456'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: /^Kinnita$/i }));
    await waitFor(() => expect(WidgetService.sendContactInfo).toHaveBeenCalledWith('1', '', '12345678'));
    await waitFor(() => expect(ChatService.sendMessageWithNewEvent).toHaveBeenCalled());
  });

  it('should give error when invalid input is given', () => {
    jest.spyOn(WidgetService, 'sendContactInfo').mockResolvedValue({} as any);
    jest.spyOn(ChatService, 'sendMessageWithNewEvent').mockResolvedValue();
    jest.spyOn(ChatService, 'sendMessagePreview').mockResolvedValue();
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText('+372 123 456'), { target: { value: '123456789123456789123456789' } });
    fireEvent.click(screen.getByRole('button', { name: /^Kinnita$/i }));
    expect(WidgetService.sendContactInfo).not.toHaveBeenCalled();
    expect(screen.getByText('Palun veenduge telefoninumbri korrektsuses')).toBeInTheDocument();
  });
});
