import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { endChat } from '../../slices/chat-slice';
import { closeConfirmationModal } from '../../slices/widget-slice';
import { RootState, useAppDispatch } from '../../store';
import { CHAT_CLOSE_NO_RESPONSE_TIMEOUT, CHAT_EVENTS } from "../../constants";

export default function ConfirmationModal(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isConfirmationModelOpen = useSelector((state: RootState) => state.widget.showConfirmationModal);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(endChat(CHAT_EVENTS.CLIENT_LEFT_FOR_UNKNOWN_REASONS));
    }, CHAT_CLOSE_NO_RESPONSE_TIMEOUT);

    const handleBeforeUnload = () => {
      dispatch(endChat(CHAT_EVENTS.CLIENT_LEFT_FOR_UNKNOWN_REASONS));
    }

    document.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!isConfirmationModelOpen) return <></>;
  return (
    <ConfirmationModalStyles>
      <div className="content" role="dialog" aria-modal="true" aria-labelledby="confirmation_modal_title">
        <h2 id="confirmation_modal_title" className="title">
          {t('widget.action.close-confirmation')}
        </h2>
        <div className="actions">
          <button className="button" title={t('widget.action.yesGotAnswer')} type="button" onClick={() => dispatch(endChat(CHAT_EVENTS.CLIENT_LEFT_WITH_ACCEPTED))}>
            {t('widget.action.yesGotAnswer')}
          </button>
          <button className="button" title={t('widget.action.yesNoAnswer')} type="button" onClick={() => dispatch(endChat(CHAT_EVENTS.CLIENT_LEFT_WITH_NO_RESOLUTION))}>
            {t('widget.action.yesNoAnswer')}
          </button>
          <button className="button" type="button" title={t('header.button.confirmation.no')} onClick={() => dispatch(closeConfirmationModal())}>
            {t('widget.action.noDontClose')}
          </button>
        </div>
      </div>
    </ConfirmationModalStyles>
  );
}

const ConfirmationModalStyles = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .button {
    border: 1px solid #003cff;
    background-color: #003cff;
    border-radius: 100px;
    color: #fff;
    font-family: 'Aino Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 16px;
    padding: 12px 18px;
    text-align: center;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 250ms, color 250ms;

    :active,
    :hover,
    :focus {
      color: #003cff;
      background-color: #fff;
      border-color: #003cff;
    }
  }

  .content {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column nowrap;
    position: absolute;
    inset: 20px;
  }

  .title {
    color: #323334;
    font-family: 'Aino Regular';
    font-weight: 400;
    font-size: 20px;
    line-height: 1.5;
    margin: 0 0 10px 0;
    text-align: center;
  }
`;
