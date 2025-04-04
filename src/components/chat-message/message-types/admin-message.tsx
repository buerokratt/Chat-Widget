import React, {useEffect, useMemo, useRef, useState} from "react";
import {motion} from "framer-motion";
import classNames from "classnames";
import {Message} from "../../../model/message-model";
import RobotIcon from "../../../static/icons/buerokratt.svg";
import {
    CHAT_EVENTS,
    isHiddenFeatureEnabled,
    MAXIMUM_MESSAGE_TEXT_LENGTH_FOR_ONE_ROW,
    RATING_TYPES,
} from "../../../constants";
import Thumbs from "../../../static/icons/thumbs.svg";
import {sendMessageWithRating, updateMessage,} from "../../../slices/chat-slice";
import {useAppDispatch} from "../../../store";
import ChatButtonGroup from "./chat-button-group";
import ChatOptionGroup from "./chat-option-group";
import {parseButtons, parseOptions} from "../../../utils/chat-utils";
import useChatSelector from "../../../hooks/use-chat-selector";
import {useTranslation} from "react-i18next";
import Markdownify from "./Markdownify";
import {ChatMessageStyled} from "../ChatMessageStyled";

const leftAnimation = {
    animate: {opacity: 1, x: 0},
    initial: {opacity: 0, x: -20},
    transition: {duration: 0.25, delay: 0.25},
};

const AdminMessage = ({message}: { message: Message }): JSX.Element => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const messageRef = useRef<HTMLDivElement>(null);
    const [isTall, setIsTall] = useState(false);
    const {nameVisibility, titleVisibility} = useChatSelector();

    const setNewFeedbackRating = (newRating: string): void => {
        const updatedMessage = {
            ...message,
            rating: message.rating !== newRating ? newRating : "",
        };
        dispatch(updateMessage(updatedMessage));
        dispatch(sendMessageWithRating(updatedMessage));
    };

    useEffect(() => {
        if (messageRef.current) {
            const height = messageRef.current.offsetHeight;
            setIsTall(height > 42);
        }
    }, [message]);

    const messageClass = `admin  ${isTall ? "tall" : ""}`;

    const hasButtons = useMemo(() => {
        return parseButtons(message).length > 0;
    }, [message.buttons]);

    const hasOptions = useMemo(() => {
        return parseOptions(message).length > 0;
    }, [message.options]);

    const csaName = useMemo(() => (
            (message.authorFirstName ?? "") +
            " " +
            (message.authorLastName ?? "")
        ).trim(),
        [message.authorFirstName, message.authorLastName]);

    return (
        <motion.div
            animate={leftAnimation.animate}
            initial={leftAnimation.initial}
            transition={leftAnimation.transition}
            ref={messageRef}
        >
            <ChatMessageStyled className="admin">
                <ChatMessageStyled className={messageClass}>
                    {nameVisibility && csaName && message.event != CHAT_EVENTS.GREETING && (
                        <div className="name">{csaName}</div>
                    )}
                    {titleVisibility &&
                        message.csaTitle &&
                        message.event != CHAT_EVENTS.GREETING && (
                            <div className="name">{message.csaTitle}</div>
                        )}
                    <div className="main">
                        <div className="icon">
                            {message.event === CHAT_EVENTS.EMERGENCY_NOTICE ? (
                                <div className="emergency">!</div>
                            ) : (
                                <img src={RobotIcon} alt="Robot icon"/>
                            )}
                        </div>
                        <div
                            className={`content ${
                                message.event === CHAT_EVENTS.EMERGENCY_NOTICE &&
                                'emergency_content'
                            }`}
                        >
                            <Markdownify message={message.content ?? ""}/>
                            {!message.content && (
                                hasOptions || hasButtons
                                    ? t('widget.action.select')
                                    : <i>{t('widget.error.empty')}</i>
                            )}
                        </div>
                        <div
                            className={classNames(
                                "feedback",
                                message.content?.length !== undefined &&
                                message.content?.length >
                                MAXIMUM_MESSAGE_TEXT_LENGTH_FOR_ONE_ROW
                                    ? "column"
                                    : "row"
                            )}
                        >
                            {![CHAT_EVENTS.GREETING, CHAT_EVENTS.EMERGENCY_NOTICE].includes(
                                    message.event as CHAT_EVENTS
                                ) &&
                                !hasButtons && !hasOptions &&
                                isHiddenFeatureEnabled && (
                                    <div>
                                        <button
                                            type="button"
                                            className={
                                                message.rating === RATING_TYPES.LIKED
                                                    ? "highlight"
                                                    : "grey"
                                            }
                                            onClick={() => {
                                                setNewFeedbackRating(RATING_TYPES.LIKED);
                                            }}
                                        >
                                            <img src={Thumbs} alt="thumbs up icon"/>
                                        </button>
                                        <button
                                            type="button"
                                            className={
                                                message.rating === RATING_TYPES.DISLIKED
                                                    ? "highlight"
                                                    : "grey"
                                            }
                                            onClick={() => {
                                                setNewFeedbackRating(RATING_TYPES.DISLIKED);
                                            }}
                                        >
                                            <img
                                                className="thumbsDownImg"
                                                src={Thumbs}
                                                alt="thumbs down icon"
                                            />
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                    {hasButtons && <ChatButtonGroup message={message}/>}
                    {hasOptions && <ChatOptionGroup message={message}/>}
                </ChatMessageStyled>
            </ChatMessageStyled>
        </motion.div>
    );
};

export default AdminMessage;
