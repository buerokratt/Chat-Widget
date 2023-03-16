import reducer, { closeConfirmationModal, showConfirmationModal, WidgetState } from './widget-slice';

const initialState: WidgetState = {
  showConfirmationModal: false,
  burokrattOnlineStatus: null,
};

describe('Widget slice', () => {
  it('should showConfirmationModal', () => {
    expect(reducer(initialState, showConfirmationModal())).toEqual({
      showConfirmationModal: true,
      burokrattOnlineStatus: null,
    });
  });

  it('should closeConfirmationModal', () => {
    expect(reducer(initialState, closeConfirmationModal())).toEqual({ ...initialState, showConfirmationModal: false });
  });
});
