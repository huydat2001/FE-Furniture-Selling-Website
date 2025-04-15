import { Button, Col, Modal, notification, Row } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/cart.context";

const FastDetailCompont = (props) => {
  const { isModalOpen, setIsModalOpen, selectedProduct } = props;
  const [count, setCount] = useState(1); // Bắt đầu từ 1 thay vì 0
  const [selectedColor, setSelectedColor] = useState(null);
  const { addToCart } = useCart();

  // Đặt màu mặc định khi selectedProduct thay đổi
  useEffect(() => {
    if (selectedProduct?.color?.length > 0) {
      setSelectedColor(selectedProduct.color[0]);
    } else {
      setSelectedColor(null);
    }
    setCount(1); // Reset số lượng về 1 khi sản phẩm thay đổi
  }, [selectedProduct]);

  const increment = () => {
    if (selectedProduct?.stock !== 0 && count < selectedProduct.stock) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const decrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1)); // Đảm bảo số lượng không nhỏ hơn 1
  };

  const handleAddToCart = async (product) => {
    if (!product?.stock || product.stock === 0) {
      notification.error({
        message: "Hết hàng",
        description: `${product.name} hiện đã hết hàng!`,
      });
      return;
    }

    if (count === 0) {
      notification.error({
        message: "Số lượng không hợp lệ",
        description: "Vui lòng chọn số lượng lớn hơn 0!",
      });
      return;
    }

    if (!selectedColor && product.color?.length > 0) {
      notification.error({
        message: "Chưa chọn màu",
        description: "Vui lòng chọn màu trước khi thêm vào giỏ hàng!",
      });
      return;
    }

    try {
      await addToCart(
        {
          id: product.id,
          color: product.color,
        },
        count,
        selectedColor
      );
      setIsModalOpen(false); // Đóng modal sau khi thêm thành công
    } catch (error) {
      notification.error({
        message: "Lỗi thêm vào giỏ hàng",
        description: error.message || "Đã có lỗi xảy ra",
      });
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      footer={null}
      maskClosable={true}
      width={"60vw"}
    >
      {selectedProduct ? (
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-auto object-cover rounded-lg"
              onError={(e) => (e.target.src = "/images/default/default.jpg")} // Hình ảnh mặc định nếu lỗi
            />
          </Col>
          <Col xs={24} md={12}>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              {selectedProduct.name}
            </h1>
            <p className="mb-4 text-gray-700">
              <strong className="text-gray-700 text-lg">Tình trạng:</strong>{" "}
              {selectedProduct.stock > 0 ? (
                <span className="text-lg">{selectedProduct.stock}</span>
              ) : (
                <span className="text-neutral-50 bg-red-200 p-1 rounded-md inline-block">
                  Hết hàng
                </span>
              )}
            </p>

            {/* Giá sản phẩm */}
            <div className="mb-4 flex items-center space-x-4 p-4 bg-stone-50">
              {selectedProduct.decreases && selectedProduct.decreases > 0 ? (
                <>
                  <span className="text-red-700 text-xl font-semibold bg-red-100 px-2 py-1 rounded">
                    -{selectedProduct.decreases}%
                  </span>
                  <span className="text-red-500 text-3xl font-semibold">
                    {selectedProduct.discountedPrice}
                  </span>
                  <span className="line-through text-gray-500 text-lg">
                    {selectedProduct.price}
                  </span>
                </>
              ) : (
                <span className="text-gray-700 text-3xl font-semibold">
                  {selectedProduct.price}
                </span>
              )}
            </div>

            {/* Màu sắc */}
            <div className="mb-4 flex items-center">
              <strong className="text-gray-700 text-lg mr-2">Màu sắc:</strong>
              {selectedProduct.color?.length > 0 ? (
                selectedProduct.color.map((c, i) => {
                  const colorMap = {
                    đỏ: "red",
                    xanh: "blue",
                    vàng: "yellow",
                    trắng: "white",
                    đen: "black",
                    xám: "gray",
                    hồng: "pink",
                    tím: "purple",
                    cam: "orange",
                  };
                  const normalizedColor = c.toLowerCase();
                  const tagColor = colorMap[normalizedColor] || normalizedColor;

                  return (
                    <button
                      key={i}
                      className={`inline-block w-5 h-5 rounded-full mr-2 border cursor-pointer hover:scale-150 transition-transform ${
                        selectedColor === c
                          ? "border-blue-500 scale-150"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: tagColor }}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                    />
                  );
                })
              ) : (
                <span className="text-gray-500">Chưa cập nhật</span>
              )}
            </div>

            {/* Bộ đếm số lượng */}
            <div className="mb-6 flex items-center gap-4">
              <strong className="text-lg font-medium text-gray-700">
                Số lượng:
              </strong>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={decrement}
                  disabled={count <= 1}
                  className={`px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors
                    ${
                      count <= 1
                        ? "cursor-not-allowed text-gray-400"
                        : "text-gray-700"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  aria-label="Giảm số lượng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <input
                  type="number"
                  value={count}
                  min="1"
                  max={selectedProduct.stock}
                  onChange={(e) => {
                    if (selectedProduct.stock !== 0) {
                      const value = parseInt(e.target.value) || 1;
                      const newValue = Math.min(
                        Math.max(1, value),
                        selectedProduct.stock
                      );
                      setCount(newValue);
                    }
                  }}
                  className="w-16 text-center border-x border-gray-300 font-medium text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Số lượng sản phẩm"
                />

                <button
                  onClick={increment}
                  disabled={count >= selectedProduct.stock}
                  className={`px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      count >= selectedProduct.stock ||
                      selectedProduct.stock === 0
                        ? "cursor-not-allowed text-gray-400"
                        : "text-gray-700"
                    }`}
                  aria-label="Tăng số lượng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                className="w-96 h-12 font-semibold rounded-md"
                variant="solid"
                color="danger"
                onClick={() => handleAddToCart(selectedProduct)} // Gọi handleAddToCart
              >
                THÊM VÀO GIỎ
              </Button>
            </div>
            <Link to={`/product/${selectedProduct.name}`}>
              <p className="underline text-lg text-gray-400 mt-10 text-center">
                Xem chi tiết sản phẩm
              </p>
            </Link>
          </Col>
        </Row>
      ) : (
        <div className="text-center py-10">Đang tải thông tin sản phẩm...</div>
      )}
    </Modal>
  );
};

export default FastDetailCompont;
