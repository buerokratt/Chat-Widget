import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { endChat } from './chat-slice';
import chatService from '../services/chat-service';

export interface WidgetState {
  showConfirmationModal: boolean;
  burokrattOnlineStatus: boolean | null;
}

const initialState: WidgetState = {
  showConfirmationModal: false,
  burokrattOnlineStatus: null,
};

export const burokrattOnlineStatusRequest = createAsyncThunk('widget/burokrattOnlineStatus', async () => chatService.burokrattOnlineStatus());

export const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
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
    builder.addCase(burokrattOnlineStatusRequest.fulfilled, (state) => {
      state.burokrattOnlineStatus = true;
    });
    builder.addCase(burokrattOnlineStatusRequest.rejected, (state) => {
      state.burokrattOnlineStatus = false;
    });
  },
});

export const { showConfirmationModal, closeConfirmationModal } = widgetSlice.actions;

export default widgetSlice.reducer;
