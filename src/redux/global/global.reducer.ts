import GlobalActionTypes from "./global.types";

interface GlobalState {
  title: string;
  hasBack: boolean;
  url: string;
  loading: boolean;
  loadingTable: boolean;
  loadingButton: boolean;
  showSuccess: boolean;
  successTitle: string;
  successDesc: string;
  showAlert: boolean;
  alertMessage: string;
  alertType: string;
  modalShow: boolean | undefined;
}

const INITIAL_STATE: GlobalState = {
  title: "",
  hasBack: false,
  url: "",
  loading: false,
  loadingTable: false,
  loadingButton: false,
  showSuccess: false,
  successTitle: "",
  successDesc: "",
  showAlert: false,
  alertMessage: "",
  alertType: "NONE",
  modalShow: false,
};

const GlobalReducer = (state = INITIAL_STATE, action: any): GlobalState => {
  switch (action.type) {
    case GlobalActionTypes.SET_HEADER:
      return {
        ...state,
        title: action.payload.title,
        hasBack: action.payload.hasBack,
        url: action.payload.url
      };
    case GlobalActionTypes.SHOW_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GlobalActionTypes.HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };
    case GlobalActionTypes.SHOW_SUCCESS:
      return {
        ...state,
        showSuccess: true,
        successTitle: action.payload.title,
        successDesc: action.payload.desc,
      };
    case GlobalActionTypes.HIDE_SUCCESS:
      return {
        ...state,
        showSuccess: false,
        successTitle: "",
        successDesc: "",
      };
    case GlobalActionTypes.SHOW_ALERT:
      return {
        ...state,
        showAlert: true,
        alertMessage: action.payload.alertMessage,
        alertType: action.payload.alertType,
      };
    case GlobalActionTypes.HIDE_ALERT:
      return {
        ...state,
        showAlert: false,
        alertMessage: "",
        alertType: "NONE",
      };
    case GlobalActionTypes.SHOW_LOADING_TABLE:
      return {
        ...state,
        loadingTable: true,
      };
    case GlobalActionTypes.HIDE_LOADING_TABLE:
      return {
        ...state,
        loadingTable: false,
      };
    case GlobalActionTypes.SHOW_LOADING_BUTTON:
      return {
        ...state,
        loadingButton: true,
      };
    case GlobalActionTypes.HIDE_LOADING_BUTTON:
      return {
        ...state,
        loadingButton: false,
      };
    case GlobalActionTypes.TOGGLE_MODAL:
      return {
        ...state,
        modalShow: action.payload,
      };
    default:
      return state;
  }
};

export default GlobalReducer;
