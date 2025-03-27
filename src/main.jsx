import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserPage from "./pages/user.jsx";
import ErrorPage from "./pages/errorPage.jsx";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import HomePage from "./pages/homePage.jsx";
import Analytic from "./pages/analytic.jsx";
import AppPage from "./pages/appds.jsx";
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
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthWrapper> */}
    <RouterProvider router={router} />
    {/* </AuthWrapper> */}
  </React.StrictMode>
);
