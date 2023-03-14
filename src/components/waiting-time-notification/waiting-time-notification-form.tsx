import styles from './waiting-time-notification.module.scss';
import Button, { ButtonColor } from '../button/button';
import { useState } from 'react';
import WaitingTimeNotificationFormSuccess from './waiting-time-notification-form-success';
import NotificationMessage from './notification-message';
import { useTranslation } from 'react-i18next';
import { RootState, useAppDispatch } from '../../store';
import { sendUserContacts } from '../../slices/chat-slice';
import { useSelector } from 'react-redux';
import useChatSelector from '../../hooks/use-chat-selector';

const WaitingTimeNotificationForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { chatId } = useChatSelector();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    message: '',
  });
  const { isLoading, isSubmitted, isFailed } = useSelector(
    (state: RootState) => state.chat.contactForm.state
  );

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await dispatch(
      sendUserContacts({
        chatId: chatId,
        endUserPhone: formData.phone,
        endUserEmail: formData.email,
      })
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <input
          type="phone"
          placeholder={t('widget.form.phone')}
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="email"
          name="email"
          placeholder={t('widget.form.email')}
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />
        <textarea
          rows={4}
          name="message"
          placeholder={t('widget.form.message')}
          value={formData.message}
          onChange={(e) => handleChange(e)}
        />
        <Button
          onClick={() => true}
          title={t('chat.feedback.button.label')}
          color={ButtonColor.BLUE}
          type="submit"
        >
          {t('chat.feedback.button.label')}
        </Button>
      </form>

      {isSubmitted && (
        <>
          <WaitingTimeNotificationFormSuccess formData={formData} />
          <NotificationMessage showIcon={true}>
            {t('widget.form.success')}
          </NotificationMessage>
        </>
      )}

      {isFailed && (
        <NotificationMessage showIcon={false}>
          {t('widget.form.error')}
        </NotificationMessage>
      )}
    </>
  );
};

export default WaitingTimeNotificationForm;
