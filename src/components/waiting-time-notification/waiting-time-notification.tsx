import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useChatSelector from '../../hooks/use-chat-selector';
import styles from './waiting-time-notification.module.scss';
import Button, { ButtonColor } from '../button/button';
import formatTime from '../../utils/format-time';
import WaitingTimeNotificationForm from './waiting-time-notification-form';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import '../chat-content/os-custom-theme.scss';
import NotificationMessage from './notification-message';
import { useAppDispatch } from '../../store';
import {
  getEstimatedWaitingTime,
  setEstimatedWaitingTimeToZero,
} from '../../slices/chat-slice';

const WaitingTimeNotification = (): JSX.Element => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();

  const { estimatedWaiting, customerSupportId } = useChatSelector();

  useEffect(() => {
    if (customerSupportId !== '') dispatch(setEstimatedWaitingTimeToZero());
    else if (estimatedWaiting.time === 0) dispatch(getEstimatedWaitingTime());
  }, [estimatedWaiting.time, dispatch, customerSupportId]);

  return (
    <div className={styles.container}>
      <NotificationMessage showIcon={true}>
        {t('notifications.waiting-time', {
          time: formatTime(estimatedWaiting.time),
        })}
      </NotificationMessage>
      <NotificationMessage showIcon={false}>
        {t('notifications.ask-contact-information')}
      </NotificationMessage>
      <div className={styles.action}>
        <Button
          title="Jah"
          color={ButtonColor.BLUE}
          onClick={() => setShowForm(true)}
        >
          {t('widget.action.yes')}
        </Button>
        <Button
          title="Ei"
          color={showForm === false ? ButtonColor.BLUE : ButtonColor.GRAY}
          onClick={() => setShowForm(false)}
        >
          {t('widget.action.no')}
        </Button>
      </div>
      {showForm && <WaitingTimeNotificationForm />}
    </div>
  );
};

export default WaitingTimeNotification;
