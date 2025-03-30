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
import PrivateRoute from "./pages/private.route.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <PrivateRoute>
      <App />
    ),
    // </PrivateRoute>

    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Analytic />
          </PrivateRoute>
        ),
      },
      {
        path: "/apps",
        element: (
          <PrivateRoute>
            <AppPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
);
