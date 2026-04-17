import {AnimatePresence} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import {useTranslation} from 'react-i18next';
import ChatMessage from '../chat-message/chat-message';
import useChatSelector from '../../hooks/use-chat-selector';
import WaitingTimeNotification from '../waiting-time-notification/waiting-time-notification';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import './os-custom-theme.scss';
import LoadingMessage from '../chat-message/message-types/loading-message';
import {ChatContentStyles} from "./ChatContentStyled";
import { useScroll } from '../../contexts/ScrollContext';
import {AUTHOR_ROLES} from '../../constants';
import {Message} from '../../model/message-model';

const srStyles = {
    position: 'absolute' as const,
    left: '-10000px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
};

const getMessageKey = (message: Message): string =>
    message.id ?? `${message.authorTimestamp}-${message.created ?? ''}`;

const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

const getAnnouncementText = (content?: string): string => {
    if (!content) return '';

    return decodeHtmlEntities(content)
        .replaceAll(/<br\s*\/?>/gi, ' ')
        .replaceAll(/[_*`#>\[\]]/g, ' ')
        .replaceAll(/\s+/g, ' ')
        .trim();
};

// Rotate an invisible suffix so repeated live-region text is treated as a fresh announcement.
const withAnnouncementMarker = (text: string, cycle: number): string =>
    `${text}${"\u2063".repeat((cycle % 3) + 1)}`;

const isAnnounceableAssistantMessage = (message: Message): boolean =>
    message.authorRole !== undefined &&
    message.authorRole !== AUTHOR_ROLES.END_USER &&
    message.isStreaming !== true &&
    !message.content?.startsWith('$') &&
    getAnnouncementText(message.content).length > 0;

const ChatContent = (): JSX.Element => {
    const OSref = useRef<OverlayScrollbarsComponent>(null);
    const responseAnnouncementTimeoutRef = useRef<number>();
    const thinkingAnnouncementTimeoutRef = useRef<number>();
    const responseAnnouncementCycleRef = useRef(0);
    const thinkingAnnouncementCycleRef = useRef(0);
    const usePrimaryResponseSlotRef = useRef(true);
    const usePrimaryThinkingSlotRef = useRef(true);
    const hasMountedRef = useRef(false);
    const previousThinkingRef = useRef(false);
    const announcedMessageKeysRef = useRef<Set<string>>(new Set());
    const pendingAssistantAnnouncementRef = useRef<{ key: string; text: string } | null>(null);
    const { t } = useTranslation();
    const {messages, failedMessages, showLoadingMessage} = useChatSelector();
    const { setScrollRef, scrollToBottom } = useScroll();
    const [responseAnnouncementPrimary, setResponseAnnouncementPrimary] = useState('');
    const [responseAnnouncementSecondary, setResponseAnnouncementSecondary] = useState('');
    const [thinkingAnnouncementPrimary, setThinkingAnnouncementPrimary] = useState('');
    const [thinkingAnnouncementSecondary, setThinkingAnnouncementSecondary] = useState('');

    const isThinking = showLoadingMessage || messages.some((message) => message.isStreaming === true);
    const thinkingMessage = t('widget.status.thinking');

    const triggerResponseAnnouncement = (text: string): void => {
        window.clearTimeout(responseAnnouncementTimeoutRef.current);
        setResponseAnnouncementPrimary('');
        setResponseAnnouncementSecondary('');
        responseAnnouncementTimeoutRef.current = window.setTimeout(() => {
            responseAnnouncementCycleRef.current += 1;
            const markedText = withAnnouncementMarker(text, responseAnnouncementCycleRef.current);
            if (usePrimaryResponseSlotRef.current) {
                setResponseAnnouncementPrimary(markedText);
                setResponseAnnouncementSecondary('');
            } else {
                setResponseAnnouncementPrimary('');
                setResponseAnnouncementSecondary(markedText);
            }
            usePrimaryResponseSlotRef.current = !usePrimaryResponseSlotRef.current;
        }, 100);
    };

    const triggerThinkingAnnouncement = (): void => {
        window.clearTimeout(thinkingAnnouncementTimeoutRef.current);
        setThinkingAnnouncementPrimary('');
        setThinkingAnnouncementSecondary('');
        thinkingAnnouncementTimeoutRef.current = window.setTimeout(() => {
            thinkingAnnouncementCycleRef.current += 1;
            const markedText = withAnnouncementMarker(thinkingMessage, thinkingAnnouncementCycleRef.current);
            if (usePrimaryThinkingSlotRef.current) {
                setThinkingAnnouncementPrimary(markedText);
                setThinkingAnnouncementSecondary('');
            } else {
                setThinkingAnnouncementPrimary('');
                setThinkingAnnouncementSecondary(markedText);
            }
            usePrimaryThinkingSlotRef.current = !usePrimaryThinkingSlotRef.current;
        }, 100);
    };

    useEffect(() => {
        setScrollRef(OSref.current);
    }, [setScrollRef]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, failedMessages, scrollToBottom]);

    useEffect(() => {
        const announceableMessages = messages.filter(isAnnounceableAssistantMessage);
        const announcedMessageKeys = announcedMessageKeysRef.current;

        if (!hasMountedRef.current) {
            announceableMessages.forEach((message) => announcedMessageKeys.add(getMessageKey(message)));
            hasMountedRef.current = true;
            return;
        }

        const nextMessageToAnnounce = announceableMessages.find(
            (message) => !announcedMessageKeys.has(getMessageKey(message))
        );

        if (!nextMessageToAnnounce) {
            return;
        }

        const messageKey = getMessageKey(nextMessageToAnnounce);
        const announcementText = getAnnouncementText(nextMessageToAnnounce.content);

        if (!announcementText) {
            return;
        }

        if (isThinking) {
            pendingAssistantAnnouncementRef.current = {
                key: messageKey,
                text: announcementText,
            };
            setResponseAnnouncementPrimary('');
            setResponseAnnouncementSecondary('');
            return;
        }

        announcedMessageKeys.add(messageKey);
        triggerResponseAnnouncement(announcementText);
    }, [isThinking, messages]);

    useEffect(() => {
        if (isThinking && !previousThinkingRef.current) {
            triggerThinkingAnnouncement();
        }

        if (!isThinking) {
            window.clearTimeout(thinkingAnnouncementTimeoutRef.current);
            setThinkingAnnouncementPrimary('');
            setThinkingAnnouncementSecondary('');
        }

        previousThinkingRef.current = isThinking;
    }, [isThinking, thinkingMessage]);

    useEffect(() => {
        if (isThinking) {
            window.clearTimeout(responseAnnouncementTimeoutRef.current);
            setResponseAnnouncementPrimary('');
            setResponseAnnouncementSecondary('');
            return;
        }

        if (!pendingAssistantAnnouncementRef.current) {
            return;
        }

        const deferredAnnouncement = pendingAssistantAnnouncementRef.current;
        pendingAssistantAnnouncementRef.current = null;
        announcedMessageKeysRef.current.add(deferredAnnouncement.key);
        triggerResponseAnnouncement(deferredAnnouncement.text);
    }, [isThinking]);

    useEffect(() => {
        return () => {
            window.clearTimeout(responseAnnouncementTimeoutRef.current);
            window.clearTimeout(thinkingAnnouncementTimeoutRef.current);
        };
    }, []);

    return (
        <AnimatePresence initial={false}>
            <ChatContentStyles>
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    style={srStyles}
                >
                    <span>{responseAnnouncementPrimary}</span>
                    <span>{responseAnnouncementSecondary}</span>
                </div>
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    style={srStyles}
                >
                    <span>{thinkingAnnouncementPrimary}</span>
                    <span>{thinkingAnnouncementSecondary}</span>
                </div>
                <OverlayScrollbarsComponent
                    className="os-host-flexbox os-custom-theme"
                    ref={OSref}
                    options={{
                        overflowBehavior: {
                            x: 'hidden',
                        },
                        scrollbars: {visibility: 'auto', autoHide: 'leave'},
                    }}
                >
                    <div
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions"
                        aria-atomic="false"
                        aria-busy={isThinking}
                    >
                        {messages.map((message, index) => {
                            if (message.id === "estimatedWaiting" && message.content === "hidden")
                                return <></>;
                            if (message.id === "estimatedWaiting")
                                return <WaitingTimeNotification key={message.authorTimestamp}/>;

                            return (
                                <ChatMessage
                                    message={message}
                                    key={`${message.authorTimestamp}-${message.created}-${message.id}`}
                                    previousMessage={index > 0 ? messages[index - 1] : undefined}
                                />
                            );
                        })}
                        {isThinking && !messages.some((message) => message.isStreaming !== undefined) && <LoadingMessage/>}
                    </div>
                </OverlayScrollbarsComponent>
            </ChatContentStyles>
        </AnimatePresence>
    );
};

export default ChatContent;
