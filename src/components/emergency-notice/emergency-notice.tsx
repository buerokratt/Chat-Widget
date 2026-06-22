import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useIsTruncated from "../../hooks/use-is-truncated";

interface EmergencyNoticeProps {
  readonly text: string;
}

const EmergencyNotice = ({ text }: EmergencyNoticeProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const truncatedTextRef = useRef<HTMLSpanElement>(null);
  const isTruncated = useIsTruncated(truncatedTextRef, [text], contentRef);

  useEffect(() => setIsExpanded(false), [text]);

  return (
    <div className="emergency-notice">
      <div className="emergency-notice-icon" aria-hidden="true">
        !
      </div>
      <div className="emergency-notice-content" ref={contentRef}>
        <span
          className={`emergency-notice-text ${
            isExpanded
              ? "emergency-notice-text-expanded"
              : "emergency-notice-text-collapsed"
          }`}
        >
          {text}
        </span>
        <span
          aria-hidden="true"
          className="emergency-notice-text emergency-notice-text-collapsed emergency-notice-text-measurement"
          ref={truncatedTextRef}
        >
          {text}
        </span>
        {isTruncated && (
          <button
            type="button"
            className="emergency-notice-read-more"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? t("widget.action.showLess") : t("widget.action.readMore")}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmergencyNotice;
