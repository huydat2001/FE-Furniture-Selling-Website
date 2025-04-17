import { Button, Col, Row } from "antd";
import { useCart } from "../../../contexts/cart.context";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

const CartComponent = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Tính discountedPrice và totalPrice
  const calculatePrices = (item) => {
    const price = item.product.price; // Giá gốc
    const decreases = item.product.decreases || 0; // Giảm giá (phần trăm)
    const discountedPrice = decreases
      ? price - (price * decreases) / 100 // Giá sau khi giảm
      : price;
    return { price, discountedPrice };
  };

  const totalPrice =
    cart && cart.length > 0
      ? cart.reduce((total, item) => {
          const { discountedPrice } = calculatePrices(item);
          return total + discountedPrice * item.quantity;
        }, 0)
      : 0;
  return (
    <>
      <div
        style={{
          maxwidth: "400px",
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

            {location.pathname !== "/checkout" && (
              <div className="flex justify-between gap-2">
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/checkout")}
                >
                  Thanh toán
                </Button>
              </div>
            )}
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
        )}
      </div>
    </>
  );
};
export default CartComponent;
//cũ
