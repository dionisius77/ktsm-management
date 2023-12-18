import { Navigate, RouteObject } from "react-router-dom";
import DashboardLayout from "layout/dashboard";
import Login from "pages/login";
import OperatingAreaIndex from "pages/dashboard/operating-area";
import Branch from "pages/dashboard/branch";
import MessagesPage from "pages/dashboard/messages";
import CreateMessage from "pages/dashboard/messages/create";
import MessageManagementDetail from "pages/dashboard/messages/detail";

const protectedRoutes: RouteObject[] = [
  { path: "", element: <Navigate to="/operating-area" /> },
  {
    path: "",
    element: <DashboardLayout />,
    children: [
      // { path: 'dashboard', element: <DashboardHome /> },
      {
        path: "operating-area",
        element: <OperatingAreaIndex />,
      },
      {
        path: "branch",
        element: <Branch />,
      },
      {
        path: "message",
        children: [
          {
            path: "",
            element: <MessagesPage />
          },
          {
            path: "create",
            element: <CreateMessage />
          },
          {
            path: ":id",
            element: <MessageManagementDetail />
          },
        ]
      }
    ],
  },
  { path: "*", element: <Navigate to="/operating-area" /> },
];

const publicRoutes: RouteObject[] = [
  { path: "", element: <Login /> },
  { path: "404", element: <div>Not Found</div> },
  { path: "*", element: <Navigate to="/" /> },
];

export { publicRoutes, protectedRoutes };
