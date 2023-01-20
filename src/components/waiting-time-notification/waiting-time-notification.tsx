import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import useChatSelector from '../../hooks/use-chat-selector';
import { ReactComponent as InfoIcon } from '../../static/icons/info.svg';

const WaitingTimeNotification = (): JSX.Element => {
  const { t } = useTranslation();
  const { estimatedWaiting } = useChatSelector();

  return (
    <WaitingTimeStyles>
      <div className="information-circle">
        <InfoIcon />
      </div>
      <div className="message-body">
        <p>{t('notifications.customer-service-busy')}</p>
        <p>{t('notifications.waiting-time')} <strong>{estimatedWaiting.time} {t('notifications.waiting-time-minutes')}</strong></p>
      </div>
    </WaitingTimeStyles>
  );
};

const WaitingTimeStyles = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 5px;
  color: #323334;
  margin: 10px;
  
  .information-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #CFD1D2;
    border-radius: 50%;
  }
  
  .message-body {
    padding: 4px 8px;
    border: 1px solid #CFD1D2;
    border-radius: 8px 8px 8px 4px;
  }
  
  p {
    font-size: 14px; 
    line-height: 24px;
    margin: 0;
  }
`;

export default WaitingTimeNotification;
