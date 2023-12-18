import GlobalActionTypes from './global.types';

export const setHeader = ({ title = '', hasBack = false, url = '' }) => {
  return (dispatch: any) =>
    dispatch({
      type: GlobalActionTypes.SET_HEADER,
      payload: { title, hasBack, url },
    });
};

export const hideSuccess = () => async (dispatch: any) => {
  dispatch({ type: GlobalActionTypes.HIDE_SUCCESS });
};

export const showLoading = () => async (dispatch: any) => {
  dispatch({ type: GlobalActionTypes.SHOW_LOADING });
};

export const hideLoading = () => async (dispatch: any) => {
  dispatch({ type: GlobalActionTypes.HIDE_LOADING });
};

export const showAlert = (alertMessage: string, alertType: string) => async (dispatch: any) => {
  dispatch({
    type: GlobalActionTypes.SHOW_ALERT,
    payload: { alertMessage, alertType },
  });
};

export const hideAlert = () => async (dispatch: any) => {
  dispatch({ type: GlobalActionTypes.HIDE_ALERT });
};

export const showLoadingButton = () => async (dispatch: any) => {
  dispatch({ type: GlobalActionTypes.SHOW_LOADING_BUTTON });
};

export const hideLoadingButton = () => async (dispatch: any) => {
  dispatch({ type: GlobalActionTypes.HIDE_LOADING_BUTTON });
};

export const toggleModal = (show: boolean | undefined) => async (dispatch: any) => {
  dispatch({
    type: GlobalActionTypes.TOGGLE_MODAL,
    payload: show,
  });
};
