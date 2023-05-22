import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { setIsChatOpen } from "../../slices/chat-slice";
import Buerokratt from "../../static/icons/buerokratt.svg";
import { useAppDispatch } from "../../store";
import { getFromSessionStorage } from "../../utils/session-storage-utils";
import useChatSelector from "../../hooks/use-chat-selector";
import styles from "./profile.module.scss";

export const Profile = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { chatConfig } = useChatSelector();
  const [delayFinished, setDelayFinished] = useState(false);
  const newMessagesAmount = getFromSessionStorage("newMessagesAmount");

  const openChat = () => {
    dispatch(setIsChatOpen(true));
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
    setTimeout(() => setDelayFinished(true), chatConfig.bubbleMessageSeconds * 1000);
  }, []);

  const getActiveProfileClass = () => {
    if (delayFinished && chatConfig.animation === "jump") return styles.profile__jump;
    if (delayFinished && chatConfig.animation === "wiggle") return styles.profile__wiggle;
    if (delayFinished && chatConfig.animation === "shockwave") return styles.profile__shockwave;
  };

  return (
    <div className={styles.profile__wrapper}>
      <motion.div
        className={`${styles.profile} ${getActiveProfileClass()}`}
        variants={variants}
        initial="initial"
        animate="animate"
        style={{
          animationIterationCount: chatConfig.proactiveSeconds,
          backgroundColor: chatConfig.color,
        }}
        role="button"
        aria-label={t("profile.button.open-chat")}
        title={t("profile.button.open-chat")}
        onKeyDown={openChat}
        onClick={openChat}
        tabIndex={0}
      >
        <img src={Buerokratt} alt="Buerokratt logo" width={45} style={{ filter: "brightness(0) invert(1)" }} />
      </motion.div>
      {chatConfig.showMessage && (
        <div
          className={`${styles.profile__greeting_message} ${delayFinished && styles.profile__greeting_message__active}`}
        >
          {chatConfig.bubbleMessageText}
        </div>
      )}
      {newMessagesAmount !== null && parseInt(newMessagesAmount, 10) > 0 ? (
        <span className={styles.bubble}>{newMessagesAmount}</span>
      ) : null}
    </div>
  );
};

export default Profile;
