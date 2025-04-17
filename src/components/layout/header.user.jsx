import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Input, Popover } from "antd";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";
import CartComponent from "../product/user/cart.user";

const { Search } = Input;

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
        <Button
          icon={<UserOutlined />}
          size="large"
          style={{ borderRadius: "6px" }}
        >
          Tài khoản
        </Button>
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
