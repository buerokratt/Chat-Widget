import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../store";
import {downloadChat, sendChatNpmRating, setFeedbackRatingGiven} from "../../slices/chat-slice";
import { isFeedbackRatingColorsEnabled } from "../../constants";
import useChatSelector from "../../hooks/use-chat-selector";
import {Download, DownloadElement} from "../../hooks/use-download-file";
import {ChatFeedbackStyled} from "./ChatFeedbackStyled";
import useWidgetSelector from "../../hooks/use-widget-selector";
import { FeedbackRatingButton } from "./feedback-rating-view";

const ChatFeedback = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {feedback} = useChatSelector();
    const { widgetConfig } = useWidgetSelector();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFeedbackButtonValue, setSelectedFeedbackButtonValue] = useState<string>("");
    const downloadRef = useRef<DownloadElement>(null);

    const handleFeedback = (feedbackRating: string | null) => {
        if (!widgetConfig.feedbackActive) {
          dispatch(setFeedbackRatingGiven(true));
          return;
        };
        if (feedbackRating === null) return;
        setSelectedFeedbackButtonValue(feedbackRating);
        dispatch(
          sendChatNpmRating({ NpmRating: parseInt(feedbackRating ?? "1", widgetConfig.isFiveRatingScale ? 5 : 10) }),
        );
        dispatch(setFeedbackRatingGiven(true));
    };

    const handleDownload = async () => {
        setLoading(true)
        try {
            const response = await dispatch(downloadChat(false));
            if (response.meta.requestStatus === "rejected") {
                return false;
            }
            downloadRef.current?.download({title: `chat-history.pdf`, data: (response.payload as any).data});
            return true;
        } finally {
            setLoading(false);
        }
    };

    return (
      <ChatFeedbackStyled>
        {widgetConfig.feedbackActive && <div className="feedback-paragraph above p-style">{widgetConfig.feedbackQuestion}</div>}
        {widgetConfig.feedbackActive && feedback.showFeedbackWarning && (
          <div className="missing-feeback p-style">{t("feedback.warningText")}</div>
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
        <div className="downloadContainer">
          <Download ref={downloadRef} />
          <a onClick={handleDownload} className="downloadLink">
            {loading ? <span className="spinner"></span> : t("widget.action.download-chat")}
          </a>
        </div>
        {widgetConfig.feedbackNoticeActive && <div className="feedback-paragraph below p-style">{widgetConfig.feedbackNotice}</div>}
      </ChatFeedbackStyled>
    );
};

export default ChatFeedback;
