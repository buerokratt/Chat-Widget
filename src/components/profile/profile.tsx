import React, {useMemo} from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { setIsChatOpen } from '../../slices/chat-slice';
import Buerokratt from '../../static/icons/buerokratt.svg';
import { useAppDispatch } from '../../store';
import styles from './profile.module.scss';
import { getFromSessionStorage } from '../../utils/session-storage-utils';
import useChatSelector from "../../hooks/use-chat-selector";

export const Profile = (): JSX.Element => {
  const { t } = useTranslation();
  const { chatStatus } = useChatSelector();
  const dispatch = useAppDispatch();
  const newMessagesAmount = getFromSessionStorage('newMessagesAmount');

  const openChat = () => {
    dispatch(setIsChatOpen(true));
  };

  const chatTitle = useMemo(() => chatStatus && chatStatus !== 'OFFLINE' ? t('profile.button.open-chat') : t('notifications.chat-offline'), [chatStatus])

  const variants = {
    initial: {
      y: 100,
    },
    animate: {
      y: 0,
    },
  };

  return (
    <motion.div key="profile" variants={variants} style={{ position: 'fixed', bottom: 0, right: 0 }} initial="initial" animate="animate">
      <div
        className={`${styles.profile} ${!chatStatus || chatStatus === 'OFFLINE' ? styles.offline : ''}`}
        role="button"
        aria-label={chatTitle}
        title={chatTitle}
        onKeyDown={openChat}
        onClick={openChat}
        tabIndex={0}
      >
        <img src={Buerokratt} alt="Buerokratt logo" style={{ filter: 'brightness(0) invert(1)' }} />
        {(!chatStatus || chatStatus === 'OFFLINE') && (
          <div className={styles.offlineBubble}>{t('notifications.chat-offline')}</div>
        )}
      </div>
      {newMessagesAmount !== null && parseInt(newMessagesAmount, 10) > 0 ? <span className={styles.bubble}>{newMessagesAmount}</span> : null}
    </motion.div>
  );
};

export default Profile;
