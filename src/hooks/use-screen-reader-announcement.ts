import { useEffect, useRef } from 'react';
import { Message } from '../model/message-model';

const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const useScreenReaderAnnouncement = (message: Message, screenReaderRef: React.RefObject<HTMLDivElement>) => {
  const announcedMessageIdRef = useRef<string | undefined>(undefined);

  const announceMessage = (content: string, messageId: string) => {
    if (!screenReaderRef.current || !content) return;
    
    const textContent = decodeHtmlEntities(content).trim();
    
    if (textContent && announcedMessageIdRef.current !== messageId) {
      screenReaderRef.current.textContent = '';
      setTimeout(() => {
        if (screenReaderRef.current) {
          screenReaderRef.current.textContent = textContent;
          announcedMessageIdRef.current = messageId;
        }
      }, 100);
    }
  };

  useEffect(() => {
    const messageId = message.id || message.authorTimestamp;
    const isStreaming = message.isStreaming !== undefined;
    
    if (!isStreaming && message.content) {
      announceMessage(message.content, messageId);
    }
  }, [message.content, message.id, message.authorTimestamp, message.isStreaming]);

  return { announceMessage };
};

export default useScreenReaderAnnouncement;

