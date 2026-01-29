import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CHAT_BUBBLE_ANIMATION,
  CHAT_BUBBLE_COLOR,
  CHAT_BUBBLE_MESSAGE_DELAY_SECONDS,
  CHAT_BUBBLE_PROACTIVE_SECONDS,
  CHAT_SHOW_BUBBLE_MESSAGE,
  CHAT_STATUS,
  IDLE_CHAT_INTERVAL,
} from "../constants";
import WidgetService from "../services/widget-service";
import { endChat, resetState } from "./chat-slice";
import { RootState } from "../store";
import chatService from "../services/chat-service";

export interface WidgetState {
  showConfirmationModal: boolean;
  burokrattOnlineStatus: boolean | null;
  widgetConfig: {
    proactiveSeconds: number;
    showMessage: boolean;
    bubbleMessageSeconds: number;
    bubbleMessageText: string;
    color: string;
    animation: string;
    isLoaded: boolean;
    isBurokrattActive: boolean | null;
    showIdleWarningMessage: boolean;
    chatActiveDuration: number;
    idleMessage: string;
    showAutoCloseText: boolean;
    autoCloseText: string;
    feedbackActive: boolean | null;
    feedbackQuestion: string;
    feedbackNoticeActive: boolean | null;
    feedbackNotice: string;
    isFiveRatingScale: boolean | null;
    instantlyOpenChatWidget?: boolean | null;
    showSubTitle?: boolean | null;
    subTitle?: string | null;
  };
  chatId?: string | null;
}

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
    idleMessage: "",
    showIdleWarningMessage: true,
    chatActiveDuration: IDLE_CHAT_INTERVAL,
    showAutoCloseText: true,
    autoCloseText:
      "Aitäh, et pöördusite, küsimuste korral võib alati uuesti ühendust võtta. Kena päeva jätku!",
    feedbackActive: null,
    feedbackQuestion: "",
    feedbackNoticeActive: null,
    feedbackNotice: "",
    isFiveRatingScale: null,
    instantlyOpenChatWidget: null,
    showSubTitle: null,
    subTitle: null,
  },
  chatId: null,
};

export const getWidgetConfig = createAsyncThunk(
  "widget/getWidgetConfig",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const previousChatId = localStorage.getItem("previousChatId");

    if (previousChatId) {
      const chat = await chatService.getChatById(previousChatId);
      if (chat.status === CHAT_STATUS.ENDED) {
        dispatch(resetState());
        localStorage.removeItem("previousChatId");
      }
    }

    dispatch(setChatId(state.chat.chatId));
    return WidgetService.getWidgetConfig();
  }
);

export const widgetSlice = createSlice({
  name: "widget",
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<string | null>) => {
      state.chatId = action.payload;
    },
    showConfirmationModal: (state) => {
      state.showConfirmationModal = true;
    },
    closeConfirmationModal: (state) => {
      state.showConfirmationModal = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(endChat.pending, (state) => {
      state.showConfirmationModal = false;
    });
    builder.addCase(getWidgetConfig.rejected, (state) => {
      state.widgetConfig.isLoaded = true;
      state.burokrattOnlineStatus = false;
    });
    builder.addCase(getWidgetConfig.fulfilled, (state, action) => {
      state.widgetConfig.isLoaded = true;
      state.widgetConfig.proactiveSeconds =
        action.payload?.widgetProactiveSeconds ?? CHAT_BUBBLE_PROACTIVE_SECONDS;
      state.widgetConfig.showMessage =
        action.payload?.isWidgetActive === "true";
      state.widgetConfig.bubbleMessageSeconds =
        action.payload?.widgetDisplayBubbleMessageSeconds ??
        CHAT_BUBBLE_MESSAGE_DELAY_SECONDS;
      state.widgetConfig.bubbleMessageText =
        action.payload?.widgetBubbleMessageText ?? "";
      state.widgetConfig.color =
        action.payload?.widgetColor ?? CHAT_BUBBLE_COLOR;
      state.widgetConfig.animation =
        action.payload?.widgetAnimation ?? CHAT_BUBBLE_ANIMATION;
      state.widgetConfig.isBurokrattActive =
        action.payload?.isBurokrattActive === "true";
      state.widgetConfig.showIdleWarningMessage =
        action.payload?.showIdleWarning === "true";
      state.widgetConfig.chatActiveDuration = parseInt(
        action.payload?.chatActiveDuration ?? IDLE_CHAT_INTERVAL.toString()
      );
      state.widgetConfig.idleMessage = action.payload?.idleMessage ?? "";
      state.widgetConfig.showAutoCloseText =
          action.payload?.showAutoCloseText === "true";
      state.widgetConfig.autoCloseText = action.payload?.autoCloseText ?? "";
      state.widgetConfig.feedbackActive =
        action.payload?.feedbackActive === "true";
      state.widgetConfig.feedbackQuestion =
        action.payload?.feedbackQuestion ?? "";
      state.widgetConfig.feedbackNoticeActive =
        action.payload?.feedbackNoticeActive === "true";
      state.widgetConfig.feedbackNotice = action.payload?.feedbackNotice ?? "";
      state.widgetConfig.isFiveRatingScale = action.payload?.isFiveRatingScale === "true";
      state.widgetConfig.instantlyOpenChatWidget =
        action.payload?.instantlyOpenChatWidget === "true";
      state.widgetConfig.showSubTitle =
        action.payload?.showSubTitle === "true";
      state.widgetConfig.subTitle = action.payload?.subTitle ?? "";  
      if (
        state.chatId != null &&
        state.widgetConfig.isBurokrattActive === false
      ) {
        state.burokrattOnlineStatus = true;
      } else {
        state.burokrattOnlineStatus = state.widgetConfig.isBurokrattActive;
      }
    });
  },
});

export const { setChatId, showConfirmationModal, closeConfirmationModal } =
  widgetSlice.actions;

export default widgetSlice.reducer;
