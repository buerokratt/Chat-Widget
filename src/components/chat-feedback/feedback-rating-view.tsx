import { StyledButtonType } from "../../constants";
import StyledButton from "../styled-components/styled-button";

interface FeedbackRatingButtonProps {
  value: number;
  isLast: boolean;
  isColorsEnabled: boolean;
  isFiveScale: boolean;
  selectedValue: string;
  onClick: (rating: string) => void;
}

export const FeedbackRatingButton: React.FC<FeedbackRatingButtonProps> = ({
  value,
  isLast,
  isColorsEnabled,
  isFiveScale,
  selectedValue,
  onClick,
}) => {
  const getColor = (val: number): string => {
    if (!isColorsEnabled) return "";

    if (isFiveScale) {
      if (val <= 2) return "red";
      if (val <= 3) return "yellow";
      return "green";
    }

    if (val <= 6) return "red";
    if (val <= 8) return "yellow";
    return "green";
  };

  const color = getColor(value);
  const displayValue = value.toString();

  return (
    <StyledButton
      className={`feedback-btn ${color} ${isLast ? "last" : ""}`}
      onClick={(e) => onClick(e.currentTarget.textContent ?? "")}
      styleType={StyledButtonType.GRAY}
      key={value}
      active={selectedValue === displayValue}
    >
      <span>{displayValue}</span>
    </StyledButton>
  );
};
