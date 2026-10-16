import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import chatReducer from '../../slices/chat-slice';
import { render } from '../../utils/test-utils';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import ChatHeader from './chat-header';
import authenticationReducer from '../../slices/authentication-slice';
import widgetReducer from '../../slices/widget-slice';
import { setChatId, setChat } from '../../slices/chat-slice';
import { CHAT_STATUS } from '../../constants';
import ChatService from '../../services/chat-service';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

const emptyFunction = () => {
  jest.fn();
};
let store: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      authentication: authenticationReducer,
      widget: widgetReducer,
    },
  });
}

describe('Header', () => {
  beforeEach(() => {
    store = createEmptyStore();
  });

  it('renders detail, minimize, fullscreen and close controls', () => {
    render(
      <Provider store={store}>
        <ChatHeader isDetailSelected={false} detailHandler={() => emptyFunction} />
      </Provider>,
    );
    ['detail', 'minimize', 'fullscreen', 'close'].forEach((action) => expect(screen.getByRole('button', { name: `header.button.${action}.label` })).toBeInTheDocument());
  });

  it('sends end chat request when closing chat', async () => {
    ChatService.endChat = jest.fn(() => Promise.resolve());
    store.dispatch(setChatId('1'));
    store.dispatch(setChat({ id: '1', status: CHAT_STATUS.OPEN, customerSupportId: '1' }));

    render(
      <Provider store={store}>
        <ChatHeader isDetailSelected={false} detailHandler={() => emptyFunction} />
        <ConfirmationModal />
      </Provider>,
    );

    const closeButton = screen.getByTitle('header.button.close.label');
    fireEvent.click(closeButton);
    const confirmationButton = screen.getByRole('button', { name: 'widget.action.yes-got-answer' });
    fireEvent.click(confirmationButton);
    expect(ChatService.endChat).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'widget.action.confirm' }));
    await waitFor(() => expect(ChatService.endChat).toHaveBeenCalledWith(expect.objectContaining({ chatId: '1' }), expect.anything()));
  });
});
