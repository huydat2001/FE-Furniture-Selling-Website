import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Badge, Button, Col, Input, Popover, Row, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";

const { Search } = Input;

const HeaderUser = () => {
  const { cart, totalItems, removeFromCart, updateQuantity, fetchCart } =
    useCart();
  const navigate = useNavigate();

  // Tính discountedPrice và totalPrice
  const calculatePrices = (item) => {
    const price = item.product.price; // Giá gốc
    const decreases = item.product.decreases || 0; // Giảm giá (phần trăm)
    const discountedPrice = decreases
      ? price - (price * decreases) / 100 // Giá sau khi giảm
      : price;
    return { price, discountedPrice };
  };

  // Tính tổng giá của giỏ hàng (dựa trên discountedPrice nếu có)
  const totalPrice =
    cart && cart.length > 0
      ? cart.reduce((total, item) => {
          const { discountedPrice } = calculatePrices(item);
          return total + discountedPrice * item.quantity;
        }, 0)
      : 0;

  // Nội dung của giỏ hàng trong Popover
  const cartContent = (
    <div
      style={{
        width: "400px",
        padding: "12px",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      {cart && cart.length > 0 ? (
        <>
          {/* Danh sách sản phẩm */}
          {cart.map((item) => {
            const { price, discountedPrice } = calculatePrices(item);
            // Kiểm tra xem images có tồn tại và có ít nhất một phần tử không
            const imageSrc =
              item.product?.images?.length > 0
                ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                    item.product.images[0]?.name
                  }`
                : "/default-image.jpg"; // Hình ảnh mặc định nếu không có images
            return (
              <Row
                key={item.product._id}
                gutter={[12, 12]}
                style={{
                  marginBottom: "12px",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "8px",
                }}
              >
                <Col span={6}>
                  <img
                    src={imageSrc}
                    alt={item.product.name}
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </Col>
                <Col span={18}>
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between">
                      <p style={{ fontWeight: "500", marginBottom: "4px" }}>
                        {item.product.name}
                      </p>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromCart(item.product._id)}
                        style={{ color: "#ff4d4f" }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Màu sắc: {item.selectedColor || "Chưa chọn"}
                    </p>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#ff4d4f",
                        fontWeight: "500",
                        marginBottom: "4px",
                      }}
                    >
                      {item.product.decreases ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                            }}
                          >
                            {price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                          <span style={{ marginLeft: "8px" }}>
                            {discountedPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </>
                      ) : (
                        <span>
                          {price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            );
          })}

          {/* Tổng tiền */}
          <div className="flex justify-between py-3 border-t border-gray-200">
            <span style={{ fontWeight: "500" }}>Tổng tiền:</span>
            <span style={{ fontWeight: "600", color: "#ff4d4f" }}>
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-between gap-2">
            <Button block onClick={() => navigate("/cart")}>
              Xem giỏ hàng
            </Button>
            <Button type="primary" block onClick={() => navigate("/checkout")}>
              Thanh toán
            </Button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>
          Bạn chưa có sản phẩm nào trong giỏ hàng
        </p>
      )}
    </div>
  );

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
        <Popover placement="bottomRight" title="Giỏ hàng" content={cartContent}>
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
