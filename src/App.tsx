import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { getFromSessionStorage } from './utils/session-storage-utils';
import { isOfficeHours } from './utils/office-hours-utils';
import Chat from './components/chat/chat';
import Profile from './components/profile/profile';
import useChatSelector from './hooks/use-chat-selector';
import useInterval from './hooks/use-interval';
import { IDLE_CHAT_INTERVAL, OFFICE_HOURS_INTERVAL_TIMEOUT, SESSION_STORAGE_CHAT_ID_KEY } from './constants';
import { getChat, getChatMessages, setChatId } from './slices/chat-slice';
import { useAppDispatch } from './store';
import useNewMessageNotification from './hooks/use-new-message-notification';
import useAuthentication from './hooks/use-authentication';
import useGetNewMessages from './hooks/use-get-new-messages';
import useGetChat from './hooks/use-get-chat';
import { customJwtExtend } from './slices/authentication-slice';

declare global {
  interface Window {
    _env_: {
      RUUTER_API_URL: string;
      TIM_AUTHENTICATION_URL: string;
      ORGANIZATION_NAME: string;
      TERMS_AND_CONDITIONS_LINK: string;
      OFFICE_HOURS: {
        ENABLED: boolean;
        TIMEZONE: string;
        BEGIN: number;
        END: number;
        DAYS: number[];
      };
    };
  }
}

const App: FC = () => {
  const dispatch = useAppDispatch();
  const { isChatOpen, messages, chatId } = useChatSelector();
  const [displayWidget, setDisplayWidget] = useState(!!getFromSessionStorage(SESSION_STORAGE_CHAT_ID_KEY) || isOfficeHours());

  useInterval(() => setDisplayWidget(!!getFromSessionStorage(SESSION_STORAGE_CHAT_ID_KEY) || isOfficeHours()), OFFICE_HOURS_INTERVAL_TIMEOUT);
  useAuthentication();
  useGetChat();
  useGetNewMessages();
  useNewMessageNotification();

  useLayoutEffect(() => {
    let waitTime = IDLE_CHAT_INTERVAL; 
    const interval = setInterval(() => {
      if(!displayWidget || !isChatOpen || !chatId) return;
      dispatch(customJwtExtend())
      waitTime = 120 * 60 * 1000;
    }, waitTime );
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    const sessionStorageChatId = getFromSessionStorage(SESSION_STORAGE_CHAT_ID_KEY);
    if (sessionStorageChatId !== null) dispatch(setChatId(sessionStorageChatId));
  }, [dispatch]);

  useEffect(() => {
    if (chatId && !messages.length) {
      dispatch(getChat());
      dispatch(getChatMessages());
    }
  }, [chatId, dispatch, messages]);

  if (displayWidget) return isChatOpen ? <Chat /> : <Profile />;
  return <></>;
};

export default App;
