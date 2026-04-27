import React, {MutableRefObject, useEffect, useState} from "react";
import {motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import {setIsChatOpen} from "../../slices/chat-slice";
import Buerokratt from "../../static/icons/buerokratt.svg";
import {useAppDispatch} from "../../store";
import useWidgetSelector from "../../hooks/use-widget-selector";
import useReloadChatEndEffect from "../../hooks/use-reload-chat-end-effect";
import {getFromLocalStorage, setToLocalStorage} from "../../utils/local-storage-utils";
import {ProfileStyles} from "./ProfileStyles";
import { LOCAL_STORAGE_INSTANTLY_OPEN_CHAT_WIDGET_KEY } from "../../constants";
import useChatSelector from "../../hooks/use-chat-selector";

interface ProfileProps {
    triggerRef?: MutableRefObject<HTMLButtonElement | null>;
}

export const Profile = ({ triggerRef }: ProfileProps): JSX.Element => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {widgetConfig} = useWidgetSelector();
    const [delayFinished, setDelayFinished] = useState(false);
    const newMessagesAmount = getFromLocalStorage("newMessagesAmount");
    const { chatId } = useChatSelector();

    const openChat = () => {
        dispatch(setIsChatOpen(true));
        if (!chatId) {
           setToLocalStorage(LOCAL_STORAGE_INSTANTLY_OPEN_CHAT_WIDGET_KEY, true); 
        }
    };

    const variants = {
        initial: {
            y: 100,
        },
        animate: {
            y: 0,
        },
    };

    useEffect(() => {
        setTimeout(() => setDelayFinished(true), widgetConfig.bubbleMessageSeconds * 1000);
    }, []);

    useReloadChatEndEffect();

    const getActiveProfileClass = () => {
        if (delayFinished && widgetConfig.animation === "jump") return "profile__jump";
        if (delayFinished && widgetConfig.animation === "wiggle") return "profile__wiggle";
        if (delayFinished && widgetConfig.animation === "shockwave") return "profile__shockwave";
    };

    return (
        <ProfileStyles as="aside" aria-label={t("profile.landmark.label")}>
            <ProfileStyles className="profile__wrapper">
                <ProfileStyles>
                <motion.button
                    ref={triggerRef}
                    className={`profile ${getActiveProfileClass()}`}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    style={{
                        animationIterationCount: widgetConfig.proactiveSeconds,
                        backgroundColor: widgetConfig.color,
                        border: '2px solid ' + widgetConfig.color
                    }}
                    aria-label={t("profile.button.open-chat")}
                    title={t("profile.button.open-chat")}
                    onClick={openChat}
                    tabIndex={0}
                >
                    <img src={Buerokratt} alt="Buerokratt logo" width={45} className="logo" loading="eager"/>
                </motion.button>
                </ProfileStyles>
                {widgetConfig.showMessage && (
                    <div
                        className={`profile__greeting_message ${delayFinished && "profile__greeting_message__active"}`}
                    >
                        {widgetConfig.bubbleMessageText}
                    </div>
                )}
                {newMessagesAmount !== null && parseInt(newMessagesAmount, 10) > 0 ? (
                    <span className="bubble">{newMessagesAmount}</span>
                ) : null}
            </ProfileStyles>
        </ProfileStyles>
    );
};

export default Profile;
