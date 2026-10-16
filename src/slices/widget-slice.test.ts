import { DEFAULT_CHAT_ACTIVE_MINUTES } from "../utils/duration-utils";
import {
  CHAT_BUBBLE_PROACTIVE_SECONDS,
  CHAT_SHOW_BUBBLE_MESSAGE,
  CHAT_BUBBLE_MESSAGE_DELAY_SECONDS,
  CHAT_BUBBLE_COLOR,
  CHAT_BUBBLE_ANIMATION,
} from "../constants";
import reducer, {
  closeConfirmationModal,
  showConfirmationModal,
  WidgetState,
} from "./widget-slice";

const initialState: WidgetState = {
  showConfirmationModal: false,
  burokrattOnlineStatus: null,
  widgetConfig: {
    proactiveSeconds: CHAT_BUBBLE_PROACTIVE_SECONDS,
    showMessage: CHAT_SHOW_BUBBLE_MESSAGE,
    bubbleMessageSeconds: CHAT_BUBBLE_MESSAGE_DELAY_SECONDS,
    bubbleMessageText: "",
    color: CHAT_BUBBLE_COLOR,
    animation: CHAT_BUBBLE_ANIMATION,
    isLoaded: false,
    isBurokrattActive: null,
    showIdleWarningMessage: false,
    chatActiveDuration: DEFAULT_CHAT_ACTIVE_MINUTES,
    idleMessage: '',
    showAutoCloseText: false,
    autoCloseText: "",
    feedbackActive: null,
    feedbackQuestion: "",
    feedbackNoticeActive: null,
    feedbackNotice: "",
    isFiveRatingScale: null,
    instantlyOpenChatWidget: null,
    showSubTitle: null,
    subTitle: null,
    responseWaitingTime: 0,
    responseProcessingNotice: "",
  },
  chatId: null,
};

describe('Widget slice', () => {
  it('opens confirmation without losing configuration', () => {
    expect(reducer(initialState, showConfirmationModal())).toEqual({ ...initialState, showConfirmationModal: true });
  });
  it('closes confirmation without losing configuration', () => {
    expect(reducer({ ...initialState, showConfirmationModal: true }, closeConfirmationModal())).toEqual(initialState);
  });
});
