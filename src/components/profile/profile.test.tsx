import React from 'react';
import { screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { render } from '../../utils/test-utils';
import Profile from './profile';
import chatReducer from '../../slices/chat-slice';
import widgetReducer from '../../slices/widget-slice';
import authenticationReducer from '../../slices/authentication-slice';
import { setToLocalStorage } from '../../utils/local-storage-utils';

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      widget: widgetReducer,
      authentication: authenticationReducer,
    },
  });
}

describe('Profile component', () => {
  beforeEach(() => {
    emptyStore = createEmptyStore();
  });

  it('renders profile button', () => {
    render(
      <Provider store={emptyStore}>
        <Profile />
      </Provider>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides bubble when no new messages', () => {
    render(
      <Provider store={emptyStore}>
        <Profile />
      </Provider>,
    );

    expect(screen.queryByText(1)).not.toBeInTheDocument();
  });

  it('renders new messages bubble', () => {
    setToLocalStorage("newMessagesAmount", 1);
    render(
      <Provider store={emptyStore}>
        <Profile />
      </Provider>,
    );

    expect(screen.getByText(1)).toBeInTheDocument();
  });
  it('cancels the delayed bubble update when unmounted', () => {
    jest.useFakeTimers();
    const schedule = jest.spyOn(window, 'setTimeout');
    const cancel = jest.spyOn(window, 'clearTimeout');
    const { unmount } = render(<Provider store={emptyStore}><Profile /></Provider>);
    const index = schedule.mock.calls.findIndex((args) => args[1] === 5000);
    expect(index).toBeGreaterThanOrEqual(0);
    const timeoutId = schedule.mock.results[index].value;
    unmount();
    expect(cancel).toHaveBeenCalledWith(timeoutId);
    jest.runOnlyPendingTimers();
    schedule.mockRestore(); cancel.mockRestore();
    jest.useRealTimers();
  });

});
