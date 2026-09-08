import { useTranslation } from "react-i18next";
import { FeedbackEmojiRatingStyled } from "./FeedbackEmojiRatingStyled";

interface FeedbackEmojiRatingProps {
  selectedValue: string;
  onClick: (rating: string) => void;
}

const MOUTHS: Record<number, string> = {
  1: "M9,22 Q16,15 23,22",
  2: "M9,20 Q16,16 23,20",
  3: "M9,19 L23,19",
  4: "M9,17 Q16,22 23,17",
  5: "M8,15 Q16,25 24,15",
};

const EYES: Record<number, { left: string; right: string }> = {
  1: { left: "M10,12 L14,10", right: "M22,12 L18,10" },
  2: { left: "M10,11 L14,11", right: "M22,11 L18,11" },
  3: { left: "M12,11 L12,11", right: "M20,11 L20,11" },
  4: { left: "M12,11 L12,11", right: "M20,11 L20,11" },
  5: { left: "M10,10 Q12,13 14,10", right: "M22,10 Q20,13 18,10" },
};

export const FeedbackEmojiRating = ({ selectedValue, onClick }: FeedbackEmojiRatingProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <FeedbackEmojiRatingStyled>
      <div className="feedback-emoji-row">
        {[1, 2, 3, 4, 5].map((value) => {
          const displayValue = value.toString();
          const isActive = selectedValue === displayValue;
          const label = t(`feedback.rating.${value}`);

          return (
            <button
              key={value}
              type="button"
              className={`feedback-emoji-btn ${isActive ? "active" : ""}`}
              title={label}
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => onClick(displayValue)}
            >
              <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d={EYES[value].left} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d={EYES[value].right} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d={MOUTHS[value]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          );
        })}
      </div>
      {selectedValue && <div className="feedback-emoji-label">{t(`feedback.rating.${selectedValue}`)}</div>}
    </FeedbackEmojiRatingStyled>
  );
};
