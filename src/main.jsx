import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/errorPage.jsx";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import AppPage from "./pages/admin/appds.jsx";
import Analytic from "./pages/admin/analytic.jsx";
import "./index.css";
import UserPage from "./pages/admin/user.jsx";
import LoginPage from "./pages/login.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Analytic />,
      },
      {
        path: "/apps",
        element: <AppPage />,
      },
      {
        path: "/users",
        element: <UserPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthWrapper> */}
    <RouterProvider router={router} />
    {/* </AuthWrapper> */}
  </React.StrictMode>
);
