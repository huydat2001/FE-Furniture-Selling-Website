import {
  LogoutOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Input, message, Popover } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";
import CartComponent from "../product/user/cart.user";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth.context";
import { getAccountAPI } from "../../services/login";

const { Search } = Input;
const ContentTKComponent = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getAccountAPI();
        if (res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [setUser]);

  // Lấy userId từ token (nếu cần)
  const token = localStorage.getItem("access_token");
  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id || decoded._id || decoded.sub; // Hỗ trợ các trường khác nhau
  } catch (error) {
    console.log("Token decode error:", error);
    userId = null;
  }

  // Xử lý đăng xuất
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser({
      username: "",
      email: "",
      fullName: "",
      role: "",
      avatar: "",
      id: "",
    });
    message.success("Đăng xuất thành công");
  };

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-lg">
      {user._id ? (
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar và tên người dùng */}
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={user.avatar}
            className="border-2 border-blue-500"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            Xin chào, {user.fullName || user.username}
          </h3>

          {/* Menu liên kết */}
          <div className="w-full space-y-2">
            <Link
              to="/user/profile"
              className="block w-full px-4 py-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
            >
              Trang cá nhân
            </Link>
            <Link
              to="/orders"
              className="block w-full px-4 py-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
            >
              Đơn hàng của tôi
            </Link>
            {user.role === "admin" ||
              (user.role === "staff" && (
                <Link
                  to="/admin"
                  className="block w-full px-4 py-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                >
                  Giao diện quản trị
                </Link>
              ))}
          </div>

          {/* Nút đăng xuất */}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            Đăng xuất
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Vui lòng đăng nhập
          </h3>
          <Button
            type="primary"
            size="large"
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
          <Button
            type="default"
            size="large"
            className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </Button>
        </div>
      )}
    </div>
  );
};
const HeaderUser = () => {
  const { totalItems } = useCart();
  const onSearch = (value) => console.log("Search:", value);

  return (
    <div className="flex justify-between px-6 py-3 max-w-[1400px] mx-auto">
      {/* Logo */}
      <Link to="/">
        <img src="/MUJI_logo.svg.png" alt="MUJI Logo" className="h-10 w-auto" />
      </Link>

      {/* Thanh tìm kiếm */}
      <div className="flex-1 mx-10">
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          onSearch={onSearch}
          enterButton={<Button type="primary" icon={<SearchOutlined />} />}
          size="large"
          style={{ maxWidth: "600px" }}
        />
      </div>

      {/* Nút hành động */}
      <div className="flex space-x-4">
        <Popover placement="bottom" content={ContentTKComponent}>
          <Button
            icon={<UserOutlined />}
            size="large"
            style={{ borderRadius: "6px" }}
          >
            Tài khoản
          </Button>
        </Popover>

        <Popover
          placement="bottomRight"
          title="Giỏ hàng"
          content={<CartComponent />}
        >
          <Badge count={totalItems}>
            <Button
              icon={<ShoppingCartOutlined />}
              size="large"
              style={{ borderRadius: "6px" }}
            >
              Giỏ hàng
            </Button>
          </Badge>
        </Popover>
      </div>
    </div>
  );
};

export default HeaderUser;
