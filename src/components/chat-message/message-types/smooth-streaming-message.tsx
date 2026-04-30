import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdownify from "./Markdownify";
import { useScroll } from "../../../contexts/ScrollContext";
import useChatSelector from "../../../hooks/use-chat-selector";

interface SmoothStreamingMessageProps {
  message: string;
  isStreaming: boolean;
  sanitizeLinks?: boolean;
  batchSize?: number;
  onChange?: (text: string) => void;
  onComplete?: () => void;
  onStopRequest?: (displayedText: string) => void;
}

const SmoothStreamingMessage: React.FC<SmoothStreamingMessageProps> = ({
  message,
  isStreaming,
  sanitizeLinks = false,
  batchSize = 2,
  onChange,
  onComplete,
  onStopRequest,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const tokenBuffer = useRef("");
  const displayIndex = useRef(0);
  const typewriterInterval = useRef<NodeJS.Timeout | null>(null);
  const previousMessage = useRef("");
  const isNewStream = useRef(true);
  const streamCompleteNotified = useRef(false);
  const typingSpeed = window._env_.STREAM_TYPING_SPEED ?? 30;
  const { scrollToBottom, resetAutoScroll } = useScroll();
  const { stopTypingStream } = useChatSelector();
  const filterDocReferences = (text: string): string => text.replaceAll(/\[do?c?\s*\d*\s*\]?/g, "");

  useEffect(() => {
    if (!stopTypingStream) {
      if (isNewStream.current || !message.startsWith(previousMessage.current)) {
        setDisplayedText("");
        tokenBuffer.current = message;
        displayIndex.current = 0;
        isNewStream.current = false;

        resetAutoScroll();

        if (typewriterInterval.current) {
          clearInterval(typewriterInterval.current);
          typewriterInterval.current = null;
        }
        startTypewriting();
      } else if (message.length > tokenBuffer.current.length) {
        tokenBuffer.current = message;

        if (!typewriterInterval.current && tokenBuffer.current.length > displayIndex.current) {
          startTypewriting();
        }
      } else if (message.length < tokenBuffer.current.length) {
        tokenBuffer.current = message;
        if (displayIndex.current > message.length) {
          displayIndex.current = message.length;
          setDisplayedText(message);
          scrollToBottom();
        }
      }

      previousMessage.current = message;
    }
  }, [message, resetAutoScroll, stopTypingStream]);

  useEffect(() => {
    if (!isStreaming) {
      isNewStream.current = true;
    }
  }, [isStreaming]);

  useEffect(() => {
    if (isStreaming) {
      streamCompleteNotified.current = false;
    }
  }, [isStreaming]);

  useEffect(() => {
    if (stopTypingStream === true) {
      clearInterval(typewriterInterval.current!);
      typewriterInterval.current = null;
      scrollToBottom();
      onStopRequest?.(displayedText);
    }
  }, [stopTypingStream]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && tokenBuffer.current.length > displayIndex.current) {
        setDisplayedText(tokenBuffer.current);
        displayIndex.current = tokenBuffer.current.length;
        scrollToBottom();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [scrollToBottom]);

  const startTypewriting = useCallback(() => {
    if (!stopTypingStream) {
      if (typewriterInterval.current) return;

      typewriterInterval.current = setInterval(() => {
        const buffer = tokenBuffer.current;
        const currentIndex = displayIndex.current;

        if (currentIndex >= buffer.length) {
          if (!isStreaming) {
            clearInterval(typewriterInterval.current!);
            typewriterInterval.current = null;
          }
          return;
        }

        // When tab is hidden, advance through the entire buffer so animation
        // doesn't stall due to browser throttling of background timers.
        const advance = document.hidden ? buffer.length - currentIndex : batchSize;
        const nextIndex = Math.min(currentIndex + advance, buffer.length);
        const newText = buffer.slice(0, nextIndex);

        setDisplayedText(newText);
        displayIndex.current = nextIndex;
        scrollToBottom();

        if (nextIndex >= buffer.length && !isStreaming) {
          clearInterval(typewriterInterval.current!);
          typewriterInterval.current = null;
        }
      }, typingSpeed);
    }
  }, [isStreaming, batchSize, typingSpeed, scrollToBottom, stopTypingStream]);

  useEffect(() => {
    if (stopTypingStream) {
      return;
    }
    if (!isStreaming && displayedText.length === message.length) {
      if (!streamCompleteNotified.current) {
        streamCompleteNotified.current = true;
        onComplete?.();
      }
      return;
    }
    onChange?.(displayedText);
  }, [isStreaming, displayedText, message.length, stopTypingStream, onChange, onComplete]);

  useEffect(() => {
    return () => {
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
      }
    };
  }, []);

  if (!isStreaming && displayedText.length === message.length) {
    return <Markdownify message={filterDocReferences(message)} sanitizeLinks={sanitizeLinks} />;
  }

  return (
    <div className="smooth-streaming-message">
      <Markdownify message={filterDocReferences(displayedText)} sanitizeLinks={sanitizeLinks} />
    </div>
  );
};

export default SmoothStreamingMessage;
