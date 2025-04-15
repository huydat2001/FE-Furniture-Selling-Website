import { createContext, useContext, useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";

import { message } from "antd";
import {
  addToCartAPI,
  getCartAPI,
  removeFromCartAPI,
  updateCartAPI,
} from "../services/api.sevice.cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);
  const fetchCart = async () => {
    try {
      const res = await getCartAPI();
      if (!res.data.statusCode) {
        throw new Error(res.message || "Lỗi khi lấy giỏ hàng");
      }
      const cartData = res.data.result || {};
      setCart(cartData.items || []);
      setTotalItems(
        cartData.items
          ? cartData.items.reduce((total, item) => total + item.quantity, 0)
          : 0
      );
    } catch (error) {
      if (error.message.includes("Token không hợp lệ")) {
        localStorage.removeItem("access_token");
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        window.location.href = "/login";
      } else {
        message.error(error.message || "Lỗi khi lấy giỏ hàng");
      }
    }
  };
  const addToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem("access_token");

      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const res = await addToCartAPI({
        userId,
        productId: product.id,
        quantity,
        selectedColor: product.color ? product.color[0] : null,
      });
      if (!res.data.statusCode) {
        throw new Error(res.message || "Lỗi khi thêm vào giỏ hàng");
      }
      const cartData = res.data.result || {};
      setCart(cartData.items || []);
      setTotalItems(
        cartData.items
          ? cartData.items.reduce((total, item) => total + item.quantity, 0)
          : 0
      );
      await fetchCart();
      message.success("Thêm vào giỏ hàng thành công");
    } catch (error) {
      if (error.message.includes("Token không hợp lệ")) {
        localStorage.removeItem("access_token");
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        window.location.href = "/login";
      } else {
        message.error(error.message || "Lỗi khi thêm vào giỏ hàng");
      }
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        message.error("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng");
        return;
      }

      const res = await removeFromCartAPI(productId);
      if (!res.data.statusCode) {
        throw new Error(res.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng");
      }

      const cartData = res.data.result || {};
      setCart(cartData.items || []);
      setTotalItems(
        cartData.items
          ? cartData.items.reduce((total, item) => total + item.quantity, 0)
          : 0
      );
      await fetchCart();

      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi xóa sản phẩm", error.message);
      if (error.message.includes("Token không hợp lệ")) {
        localStorage.removeItem("access_token");
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        window.location.href = "/login";
      } else {
        message.error(error.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng");
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        message.error("Vui lòng đăng nhập để cập nhật số lượng");
        return;
      }

      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        const res = await updateCartAPI(productId, quantity);
        if (!res.data.statusCode) {
          throw new Error(res.message || "Lỗi khi cập nhật giỏ hàng");
        }
        const cartData = res.data.result || {};
        setCart(cartData.items || []);
        setTotalItems(
          cartData.items
            ? cartData.items.reduce((total, item) => total + item.quantity, 0)
            : 0
        );
        await fetchCart();

        message.success("Cập nhật số lượng thành công");
      }
    } catch (error) {
      console.error("Lỗi cập nhật số lượng", error.message);
      if (error.message.includes("Token không hợp lệ")) {
        localStorage.removeItem("access_token");
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        window.location.href = "/login";
      } else {
        message.error(error.message || "Lỗi khi cập nhật số lượng");
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
