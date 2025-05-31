import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/errorPage.jsx";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import AppPage from "./pages/admin/appds.jsx";
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
import { CartProvider } from "./contexts/cart.context.jsx";
import CheckoutPage from "./pages/user/checkout.user.jsx";
import VNPayReturnPage from "./components/checkout/vnpay.returnpage.jsx";
import OrderPage from "./pages/admin/order.jsx";
import HistoryOrderPage from "./pages/user/history.order.jsx";
import AnalyticPage from "./pages/admin/analytic.jsx";
import CommentPage from "./pages/admin/comment.jsx";

import ChatBoxPage from "./pages/admin/chat.jsx";
import SignUpPage from "./pages/signup.jsx";
import ForgotPasswordPage from "./pages/forgot.password.jsx";
import ProfilePage from "./pages/user/profile.jsx";
import ProductListPage from "./pages/user/product.category.jsx";
import ShowRoomPage from "./pages/user/showroom.jsx";
import Informaitonpage from "./pages/user/information.jsx";
import SpecialProduct from "./pages/user/special.product.jsx";
import AllProductpage from "./pages/user/allproduct.jsx";
import ExportPage from "./pages/admin/export.jsx";
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
            <AnalyticPage />
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
      {
        path: "orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "comments",
        element: (
          <PrivateRoute>
            <CommentPage />
          </PrivateRoute>
        ),
      },
      {
        path: "chats",
        element: (
          <PrivateRoute>
            <ChatBoxPage />
          </PrivateRoute>
        ),
      },
      {
        path: "export",
        element: (
          <PrivateRoute>
            <ExportPage />
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
      {
        path: "product/:name",
        element: <UserProductPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "checkout/:id",
        element: <CheckoutPage />,
      },
      {
        path: "orders",
        element: <HistoryOrderPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "products/category/:id",
        element: <ProductListPage />,
      },
      {
        path: "showroom",
        element: <ShowRoomPage />,
      },
      {
        path: "infomation",
        element: <Informaitonpage />,
      },
      {
        path: "specialproduct",
        element: <SpecialProduct />,
      },
      {
        path: "allproducts",
        element: <AllProductpage />,
      },
    ],
  },
  {
    path: "vnpay_return",
    element: <VNPayReturnPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <SignUpPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthWrapper>
);
