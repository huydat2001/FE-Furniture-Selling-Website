import {
  LogoutOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Input, message, Popover } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";
import CartComponent from "../product/user/cart.user";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../contexts/auth.context";
import { getAccountAPI } from "../../services/login";
import { getProductByQuyeryAPI } from "../../services/api.service.product";

const { Search } = Input;

const ContentTKComponent = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const token = localStorage.getItem("access_token");
  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id || decoded._id || decoded.sub;
  } catch (error) {
    console.log("Token decode error:", error);
    userId = null;
  }

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
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={user.avatar}
            className="border-2 border-blue-500"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            Xin chào, {user.fullName || user.username}
          </h3>
          <div className="w-full space-y-2">
            <Link
              to="/profile"
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
            {(user.role === "admin" || user.role === "staff") && (
              <Link
                to="/admin"
                className="block w-full px-4 py-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
              >
                Giao diện quản trị
              </Link>
            )}
          </div>
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
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]); // State để lưu kết quả tìm kiếm
  const [searchValue, setSearchValue] = useState(""); // State để lưu giá trị tìm kiếm
  const searchContainerRef = useRef(null); // Tham chiếu đến ô tìm kiếm
  const searchDropdownRef = useRef(null); // Tham chiếu đến danh sách tìm kiếm

  // Hàm xử lý tìm kiếm
  const onSearch = async (value) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const filters = { search: value, status: "active" };
      const res = await getProductByQuyeryAPI(1, 5, filters); // Lấy 5 sản phẩm đầu tiên
      if (res.data?.result) {
        setSearchResults(res.data.result);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    }
  };

  // Xử lý khi người dùng nhập ký tự
  const onChangeSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value); // Gọi hàm tìm kiếm mỗi khi người dùng nhập ký tự
  };

  // Xử lý click ra ngoài để ẩn danh sách
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setSearchResults([]);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col px-6 py-3 max-w-[1400px] mx-auto">
      <div
        className="flex justify-between items-center "
        ref={searchContainerRef}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src="/MUJI_logo.svg.png"
            alt="MUJI Logo"
            className="h-10 w-auto mb-4"
          />
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 mx-10 relative">
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            onSearch={onSearch}
            onChange={onChangeSearch} // Xử lý khi người dùng nhập ký tự
            value={searchValue}
            enterButton={<Button type="primary" icon={<SearchOutlined />} />}
            size="large"
            style={{ maxWidth: "600px" }}
          />

          {/* Hiển thị danh sách sản phẩm tìm kiếm */}
          {searchValue && searchResults.length > 0 && (
            <div
              ref={searchDropdownRef}
              className="absolute top-full left-0 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
              style={{ top: searchContainerRef.current?.clientHeight || 56 }}
            >
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product.name}`}
                  className="block p-4 hover:bg-gray-100 border-b last:border-b-0"
                  onClick={() => {
                    setSearchValue(""); // Xóa ô tìm kiếm khi nhấp vào sản phẩm
                    setSearchResults([]); // Ẩn danh sách tìm kiếm
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                          product.images[0].name
                        }` ||
                        `${
                          import.meta.env.VITE_BACKEND_URL
                        }/images/product/default.png`
                      }
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {product.price.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex space-x-4 mb-4">
          <Popover placement="bottom" content={<ContentTKComponent />}>
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
    </div>
  );
};

export default HeaderUser;
