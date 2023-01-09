import { useAppSelector } from '../store';
import { CHAT_STATUS } from '../constants';
import { ChatState } from '../slices/chat-slice';

interface ExtraProps {
  isChatEnded: boolean;
  isChatOffline: boolean;
}

const useChatSelector = (): ChatState & ExtraProps => {
  const chatState = useAppSelector(({ chat }) => chat);
  const extraProps = {
    isChatEnded: chatState?.chatStatus === CHAT_STATUS.ENDED,
    isChatOffline: chatState?.chatStatus === CHAT_STATUS.OFFLINE,
  };
  return { ...chatState, ...extraProps };
};

export default useChatSelector;
