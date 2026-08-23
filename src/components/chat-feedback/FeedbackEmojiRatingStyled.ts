import styled from "styled-components";
import { colors, fontChat } from "../../styling/style_settings";

export const FeedbackEmojiRatingStyled = styled.div`
  .feedback-emoji-row {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .feedback-emoji-btn {
    background: transparent;
    border: 0;
    padding: 0.25rem;
    cursor: pointer;
    color: ${colors.placeholderGray};
    border-radius: 50%;
    transition: 150ms color, 150ms transform;

    &:hover,
    &:focus {
      color: ${colors.primary};
    }

    &.active {
      color: ${colors.primary};
      transform: scale(1.15);
    }
  }

  .feedback-emoji-label {
    text-align: center;
    font-family: ${fontChat};
    font-size: 0.9rem;
    color: ${colors.mustakivi};
    margin-bottom: 0.5rem;
  }
`;
