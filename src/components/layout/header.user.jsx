import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Input, Popover } from "antd";

const { Search } = Input;

const HeaderUser = () => {
  const cartContent = (
    <div style={{ width: "250px", padding: "8px" }}>
      <div className="flex justify-between py-2">
        <span>Tổng tiền:</span>
        <span className="font-semibold">0đ</span>
      </div>
      <div className="flex justify-between gap-2">
        <Button block>Xem giỏ hàng</Button>
        <Button type="primary" block>
          Thanh toán
        </Button>
      </div>
    </div>
  );

  const onSearch = (value) => console.log("Search:", value);

  return (
    <div className="flex  justify-between px-6 py-3 max-w-[1400px] mx-auto">
      {/* Logo */}
      <div>
        <img src="/MUJI_logo.svg.png" alt="MUJI Logo" className="h-10 w-auto" />
      </div>

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
      <div className="flex  space-x-4">
        <Button
          icon={<UserOutlined />}
          size="large"
          style={{ borderRadius: "6px" }}
        >
          Tài khoản
        </Button>
        <Popover placement="bottomRight" title="Giỏ hàng" content={cartContent}>
          <Badge count={5}>
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
