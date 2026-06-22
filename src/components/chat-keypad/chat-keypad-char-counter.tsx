import {ReactElement, useMemo} from 'react';
import styled, {css} from 'styled-components';
import {
    FEEDBACK_MESSAGE_LIMIT_VISIBILE_AT,
    FEEDBACK_MESSAGE_LIMIT_WARNING_AT,
    FEEDBACK_MESSAGE_MAX_CHAR_LIMIT,
    MESSAGE_MAX_CHAR_LIMIT,
    MESSAGE_VISIBILITY_LIMIT,
    MESSAGE_WARNING_LIMIT,
} from '../../constants';
import { isMobile } from "../../utils/browser-utils";

interface ChatKeypadCharCounterType {
    userInput: string;
    isFeedback?: boolean;
    isConfirmationFeedback?: boolean;
}

const ChatKeypadCharCounter = (props: ChatKeypadCharCounterType): ReactElement => {
    const limit = useMemo(() => {
      const isFeedback = typeof props.isFeedback === 'boolean' && props.isFeedback;
      return {
        maxChar: isFeedback ? FEEDBACK_MESSAGE_MAX_CHAR_LIMIT : MESSAGE_MAX_CHAR_LIMIT,
        warning: isFeedback ? FEEDBACK_MESSAGE_LIMIT_WARNING_AT : MESSAGE_WARNING_LIMIT,
        visibility: isFeedback ? FEEDBACK_MESSAGE_LIMIT_VISIBILE_AT : MESSAGE_VISIBILITY_LIMIT,
      };
    }, [props.isFeedback]);

    const {userInput = ''} = props;
    const currentCount = userInput.length;

    return (
      <ChatKeypadCharCounterStyle
        warning={currentCount > limit.warning}
        isVisible={currentCount > limit.visibility}
        isConfirmationFeedback={props.isConfirmationFeedback}
      >
        {currentCount}/{limit.maxChar}
      </ChatKeypadCharCounterStyle>
    );
};

const grayVariant = css`
    color: #a7a9ab;
`;
const orangeVariant = css`
    color: #ff4800;
`;

const marginCheck = isMobile() ? "0rem 3.5rem 0.45rem 0" : "-0.45rem 3.5rem 0.25rem 0";

const ChatKeypadCharCounterStyle = styled.div<{
  warning: boolean;
  isVisible: boolean;
  isConfirmationFeedback?: boolean;
}>`
  ${(props) => (props.warning ? orangeVariant : grayVariant)}
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  font-size: 0.7rem;
  margin: ${(props) => (props.isConfirmationFeedback ? "0" : marginCheck)};
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
`;

export default ChatKeypadCharCounter;
