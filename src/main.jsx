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
import CategoryPage from "./pages/admin/category.jsx";
import DiscountPage from "./pages/admin/discount.jsx";
import BrandPage from "./pages/admin/brand.jsx";
import ProductPage from "./pages/admin/product.jsx";
import UserLayout from "./pages/user/UserLayout.jsx";
import UserProductPage from "./pages/user/user.product.jsx";
import HomePage from "./pages/user/homepage.user.jsx";
import ScrollToTop from "./components/until/scrolltotop.jsx";
import { CartProvider } from "./contexts/cart.context.jsx";
const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      // <PrivateRoute>
      <App />
    ),
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
        path: "apps",
        element: (
          <PrivateRoute>
            <AppPage />
          </PrivateRoute>
        ),
      },
      {
        path: "users",
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        ),
      },
      {
        path: "categorys",
        element: (
          <PrivateRoute>
            <CategoryPage />
          </PrivateRoute>
        ),
      },
      {
        path: "discounts",
        element: (
          <PrivateRoute>
            <DiscountPage />
          </PrivateRoute>
        ),
      },
      {
        path: "brands",
        element: (
          <PrivateRoute>
            <BrandPage />
          </PrivateRoute>
        ),
      },
      {
        path: "products",
        element: (
          <PrivateRoute>
            <ProductPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:name", element: <UserProductPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthWrapper>
);
