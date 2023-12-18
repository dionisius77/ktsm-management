import Cookies from "cookies-js";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AuthReducer from "./auth/auth.reducer";
import CookieStorage from "./cookieStore";
import GlobalReducer from "./global/global.reducer";

const authPersistConfig = {
  key: "authonly",
  storage: new CookieStorage(Cookies, {}),
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthReducer), // NOTE: only persist auth to reducer
  globalState: GlobalReducer,
});

export default rootReducer;
