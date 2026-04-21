import {AnimatePresence} from 'framer-motion';
import {useEffect, useRef} from 'react';
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
import useLiveRegionAnnouncement from '../../hooks/use-live-region-announcement';

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

const isAnnounceableAssistantMessage = (message: Message): boolean =>
    message.authorRole !== undefined &&
    message.authorRole !== AUTHOR_ROLES.END_USER &&
    message.isStreaming !== true &&
    !message.content?.startsWith('$') &&
    getAnnouncementText(message.content).length > 0;

const ChatContent = (): JSX.Element => {
    const OSref = useRef<OverlayScrollbarsComponent>(null);
    const hasMountedRef = useRef(false);
    const previousThinkingRef = useRef(false);
    const announcedMessageKeysRef = useRef<Set<string>>(new Set());
    const pendingAssistantAnnouncementRef = useRef<{ key: string; text: string } | null>(null);
    const { t } = useTranslation();
    const {messages, failedMessages, showLoadingMessage} = useChatSelector();
    const { setScrollRef, scrollToBottom } = useScroll();
    const {
        announce: announceResponse,
        clearAnnouncement: clearResponseAnnouncement,
        primaryAnnouncement: responseAnnouncementPrimary,
        secondaryAnnouncement: responseAnnouncementSecondary,
    } = useLiveRegionAnnouncement();
    const {
        announce: announceThinking,
        clearAnnouncement: clearThinkingAnnouncement,
        primaryAnnouncement: thinkingAnnouncementPrimary,
        secondaryAnnouncement: thinkingAnnouncementSecondary,
    } = useLiveRegionAnnouncement();

    const isThinking = showLoadingMessage || messages.some((message) => message.isStreaming === true);
    const thinkingMessage = t('widget.status.thinking');

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

        if (!nextMessageToAnnounce) return;

        const messageKey = getMessageKey(nextMessageToAnnounce);
        const announcementText = getAnnouncementText(nextMessageToAnnounce.content);

        if (!announcementText) return;

        if (isThinking) {
            pendingAssistantAnnouncementRef.current = {
                key: messageKey,
                text: announcementText,
            };
            clearResponseAnnouncement();
            return;
        }

        announcedMessageKeys.add(messageKey);
        announceResponse(announcementText);
    }, [announceResponse, clearResponseAnnouncement, isThinking, messages]);

    useEffect(() => {
        if (isThinking && !previousThinkingRef.current) announceThinking(thinkingMessage);
        if (!isThinking) clearThinkingAnnouncement();

        previousThinkingRef.current = isThinking;
    }, [announceThinking, clearThinkingAnnouncement, isThinking, thinkingMessage]);

    useEffect(() => {
        if (isThinking) return clearResponseAnnouncement();
        if (!pendingAssistantAnnouncementRef.current) return;

        const deferredAnnouncement = pendingAssistantAnnouncementRef.current;
        pendingAssistantAnnouncementRef.current = null;
        announcedMessageKeysRef.current.add(deferredAnnouncement.key);
        announceResponse(deferredAnnouncement.text);
    }, [announceResponse, clearResponseAnnouncement, isThinking]);

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
