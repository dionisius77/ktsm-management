import moment from "moment";
import { useEffect } from "react";
import { logoutRedux } from "redux/auth/auth.action";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import "react-toastify/dist/ReactToastify.css";
import { protectedRoutes, publicRoutes } from "./routes";
import { useRoutes } from "react-router-dom";

const AppRoutes = () => {
  const { token, expiredDate } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (expiredDate && token) {
      const now = moment().format("YYYY-MM-DD");
      if (expiredDate <= now) {
        dispatch(logoutRedux());
      }
    } else {
      dispatch(logoutRedux());
    }
  }, [expiredDate]);

  const permittedRoutes = token ? protectedRoutes : publicRoutes
  const element = useRoutes(permittedRoutes)

  return (
    <div>{element}</div>
  );
};

export default AppRoutes;
