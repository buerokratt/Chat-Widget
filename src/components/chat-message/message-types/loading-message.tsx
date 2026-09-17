import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RobotIcon from "../../../static/icons/buerokratt.svg";
import { LoadingAnimationStyles } from "../LoadingAnimationStyled";
import { ChatMessageStyled } from "../ChatMessageStyled";
import useWidgetSelector from "../../../hooks/use-widget-selector";
import BouncingLoader from "../../bouncing-loader";
import { isMobileApp } from "../../../utils/browser-utils";

const LoadingMessage = (): JSX.Element => {
  const { widgetConfig } = useWidgetSelector();
  const { responseWaitingTime, responseProcessingNotice } = widgetConfig;
  const [showProcessingNotice, setShowProcessingNotice] = useState(false);
  const mobileApp = isMobileApp();

  useEffect(() => {
    if (!responseWaitingTime || !responseProcessingNotice) return;

    const timer = setTimeout(() => {
      setShowProcessingNotice(true);
    }, responseWaitingTime * 1000);

    return () => clearTimeout(timer);
  }, [responseWaitingTime, responseProcessingNotice]);

  return (
    <motion.div aria-hidden="true">
      <ChatMessageStyled className={`admin ${mobileApp ? "mobile-app" : ""}`}>
        <div className="message">
          <div className="message-main">
            {!mobileApp && (
              <div className="message-icon">
                <img src={RobotIcon} alt="Robot icon" />
              </div>
            )}
            <div>
              <div className="content">
                <LoadingAnimationStyles>
                  {showProcessingNotice ? (
                    <p className="processing-notice">{responseProcessingNotice}</p>
                  ) : (
                    <BouncingLoader />
                  )}
                </LoadingAnimationStyles>
              </div>
            </div>
          </div>
        </div>
      </ChatMessageStyled>
    </motion.div>
  );
};

export default LoadingMessage;
