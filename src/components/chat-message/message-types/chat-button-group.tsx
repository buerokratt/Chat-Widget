
import React, { useMemo, useState } from 'react';
import { Message } from '../../../model/message-model';
import { AUTHOR_ROLES } from '../../../constants';
import { useAppDispatch } from '../../../store';
import { addMessage, initChat, queueMessage, sendNewMessage } from '../../../slices/chat-slice';
import useChatSelector from '../../../hooks/use-chat-selector';
import styles from '../chat-message.module.scss';

const ChatButtonGroup = ({ content }: { content: string }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { chatId, loading } = useChatSelector();
  const [used, setUsed] = useState(false);

  if(!content)
    return <></>;
  
  const buttons = useMemo(() => JSON.parse(content), [content]);
  
  const addNewMessageToState = (userInput: string): void => {
    const message: Message = {
      chatId,
      content: encodeURIComponent(userInput),
      authorTimestamp: new Date().toISOString(),
      authorRole: AUTHOR_ROLES.END_USER,
    };

    dispatch(addMessage(message));

    if (!chatId && !loading) {
      dispatch(initChat(message));
    }
    if (loading) {
      dispatch(queueMessage(message));
    }
    if (chatId) {
      dispatch(sendNewMessage(message));
    }

    setUsed(true);
  }

  return (
    <div>
      {buttons?.map((button: string) => (
        <button
          type="button"
          className={`${styles['action-button']}`}
          onClick={() => addNewMessageToState(button)}
          disabled={used}
        >
          {button}
        </button>
      ))}
    </div>
  );
}

export default ChatButtonGroup;
