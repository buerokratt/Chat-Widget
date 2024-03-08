import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import ChatMessage from '../chat-message/chat-message';
import useChatSelector from '../../hooks/use-chat-selector';
import { useAppDispatch } from '../../store';
import { getEstimatedWaitingTime, getNameVisibility, getTitleVisibility, setEstimatedWaitingTimeToZero } from '../../slices/chat-slice';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import './os-custom-theme.scss';
import styles from './chat-content.module.scss';
import WaitingTimeNotification from '../waiting-time-notification/waiting-time-notification';

const ChatContent = (): JSX.Element => {
  const OSref = useRef<OverlayScrollbarsComponent>(null);
  const { 
    messages, 
    estimatedWaiting, 
    customerSupportId, 
  } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (OSref.current) {
      const instance = OSref.current.osInstance();
      instance?.scroll({ y: '100%' }, 200);
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if(!customerSupportId) {
        dispatch(getEstimatedWaitingTime());
      } else {
        dispatch(setEstimatedWaitingTimeToZero());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [customerSupportId]);

  useEffect(() => {
    if (!customerSupportId) {
      dispatch(getNameVisibility());
      dispatch(getTitleVisibility());
    }
  }, [customerSupportId]);

  return (
    <AnimatePresence initial={false}>
      <div className={styles.content}>
        <OverlayScrollbarsComponent
          className="os-host-flexbox os-custom-theme"
          ref={OSref}
          options={{
            overflowBehavior: {
              x: 'hidden',
            },
            scrollbars: { visibility: 'auto', autoHide: 'leave' },
          }}
        >
          {messages.map((message) => 
            message.chatId === 'estimatedWaiting' 
            ? <WaitingTimeNotification />
            : <ChatMessage 
                message={message}
                key={`${message.authorTimestamp}-${message.created}-${message.id}`}
              />
          )}
        </OverlayScrollbarsComponent>
      </div>
    </AnimatePresence>
  );
};

export default ChatContent;
