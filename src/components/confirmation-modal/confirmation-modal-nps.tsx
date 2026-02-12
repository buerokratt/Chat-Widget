import React, { useState } from "react";
import Button, { ButtonColor } from "../button/button";
import { useAppDispatch } from "../../store";
import { endChat, sendChatNpmRating, sendFeedbackMessage, setFeedbackRatingGiven } from "../../slices/chat-slice";
import { useTranslation } from "react-i18next";
import {
  CHAT_EVENTS,
  FEEDBACK_MESSAGE_MAX_CHAR_LIMIT,
  isFeedbackRatingColorsEnabled,
} from "../../constants";
import { ConfirmationModalStyled, ConfirmationModalStyles } from "./ConfirmationModalStyled";
import useWidgetSelector from "../../hooks/use-widget-selector";
import ChatKeypadCharCounter from "../chat-keypad/chat-keypad-char-counter";
import { FeedbackRatingButton } from "../chat-feedback/feedback-rating-view";

interface Props {
  readonly npsFeedback: {
    readonly feedback: CHAT_EVENTS | null;
    readonly showNps: boolean;
  };
}

const ConfirmationModalNps = ({ npsFeedback }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { widgetConfig } = useWidgetSelector();
  const endChatParams = {
    event: npsFeedback.feedback,
    isUpperCase: true,
  };
  const [selectedFeedbackButtonValue, setSelectedFeedbackButtonValue] = useState<string>("");

  const [feedbackText, setFeedbackText] = useState<string>("");

  const handleFeedback = (feedbackRating: string | null) => {
    if (feedbackRating === null) return;
    setSelectedFeedbackButtonValue(feedbackRating);
    dispatch(
      sendChatNpmRating({ NpmRating: parseInt(feedbackRating ?? "1") }),
    );
    dispatch(setFeedbackRatingGiven(true));
  };
  return (
    <ConfirmationModalStyled>
      <div className="npsContainer">
        <ConfirmationModalStyles>
          {widgetConfig.feedbackActive && (
            <div className="feedback-paragraph above p-style">{widgetConfig.feedbackQuestion}</div>
          )}
          {widgetConfig.feedbackActive && (
            <div className="feedback-box-input" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {(() => {
                const isFiveScale = !!widgetConfig.isFiveRatingScale;
                const buttonCount = isFiveScale ? 5 : 11;
                const startValue = isFiveScale ? 1 : 0;
                const lastValue = isFiveScale ? 5 : 10;

                return Array.from(new Array(buttonCount).keys()).map((index: number) => {
                  const value = startValue + index;
                  const isLast = value === lastValue;

                  return (
                    <FeedbackRatingButton
                      key={value}
                      value={value}
                      isLast={isLast}
                      isColorsEnabled={isFeedbackRatingColorsEnabled}
                      isFiveScale={isFiveScale}
                      selectedValue={selectedFeedbackButtonValue}
                      onClick={handleFeedback}
                    />
                  );
                });
              })()}
            </div>
          )}
          {widgetConfig.feedbackNoticeActive && (
            <div className="feedback-paragraph-secondary below p-style">{widgetConfig.feedbackNotice}</div>
          )}
          {widgetConfig.feedbackNoticeActive && (
            <>
              <textarea
                className="feedbackInput"
                aria-label={t("keypad.input.label")}
                placeholder={t("keypad.input.feedbackPlaceholder")}
                onChange={(e) => {
                  setFeedbackText(e.target.value);
                }}
              />
              <ChatKeypadCharCounter userInput={feedbackText} isFeedback isConfirmationFeedback />
            </>
          )}
        </ConfirmationModalStyles>
        <div className="npsActions">
          <Button
            onClick={() => {
              if (feedbackText !== "" && feedbackText.trim().length <= FEEDBACK_MESSAGE_MAX_CHAR_LIMIT) {
                dispatch(sendFeedbackMessage({ userInput: feedbackText }));
              }
              dispatch(endChat(endChatParams));
            }}
            title={t("widget.action.skip")}
            color={ButtonColor.GRAY}
          >
            {t("widget.action.skip")}
          </Button>
          <Button
            onClick={() => {
              if (feedbackText !== "" && feedbackText.trim().length <= FEEDBACK_MESSAGE_MAX_CHAR_LIMIT) {
                dispatch(sendFeedbackMessage({ userInput: feedbackText }));
              }
              dispatch(endChat(endChatParams));
            }}
            title={t("widget.action.confirm")}
            color={feedbackText.trim().length > FEEDBACK_MESSAGE_MAX_CHAR_LIMIT ? ButtonColor.GRAY : ButtonColor.BLUE}
            disabled={feedbackText.trim().length > FEEDBACK_MESSAGE_MAX_CHAR_LIMIT}
          >
            {t("widget.action.confirm")}
          </Button>
        </div>
      </div>
    </ConfirmationModalStyled>
  );
};

export default ConfirmationModalNps;
