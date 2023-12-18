import { useState } from "react";
import { Button, Input } from "react-daisyui";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import imageBanner from "assets/images/login-admin-panel.jpg";
import imageLogo from "assets/images/ktsm.jpeg";
import { loginRedux } from "redux/auth/auth.action";
import { useAppDispatch } from "redux/hook";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [hidePassword, setHidePassword] = useState(true);
  const dispatch = useAppDispatch();

  const login = (e: any) => {
    e.preventDefault();
    dispatch(loginRedux(form.email, form.password));
  };
  const handleChange = (e: any) => {
    setForm((temp) => ({ ...temp, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-[65%] h-screen hidden md:block">
        <img
          src={imageBanner}
          alt="persona"
          className="w-[65%] h-screen flex flex-col items-center justify-center gap-4 object-cover fixed"
        />
      </div>
      <div className="md:w-[35%] w-full h-screen bg-white flex flex-col items-center gap-10 p-12">
        <div className="flex justify-center items-center">
          <img
            src={imageLogo}
            className="h-48 w-48"
            alt="sims"
          />
        </div>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={login}
        >
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter Email"
              name="email"
              // className="bg-white focus:!outline-none focus:ring-0 focus:border-none rounded-md h-10 border-gray-300 border w-full"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type={hidePassword ? "password" : "text"}
              placeholder="Enter Password"
              name="password"
              // className="border-none h-10 flex-1 focus:!outline-none focus:ring-0 focus:border-none rounded-md border border-gray-300"
              onChange={handleChange}
              required
            />
            <Link
              to={"/reset-password"}
              className="text-xs italic text-blue-500 text-right"
            >
              Forgot password?
            </Link>
          </div>
          {/* <div className="flex flex-row w-full gap-2 items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="border-gray-300 rounded"
            />
            <label
              className="text-sm font-medium cursor-pointer"
              htmlFor="rememberMe"
            >
              Remember me
            </label>
          </div> */}
          <button
            type="submit"
            className="w-full h-10 rounded-md bg-primary text-white mt-10"
          >
            Log In
          </button>
        </form>
        {/* <div className="w-full inline-flex gap-1 items-center justify-center text-center">
          <div className="text-sm">{`Don't have an account?`}</div>
          <Link to={"/register"} className="text-sm text-blue-600">
            Signup now
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
