// file: user.product.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByQuyeryAPI } from "../../services/api.service.product";
import {
  Button,
  Rate,
  Spin,
  notification,
  Row,
  Col,
  Carousel,
  Tabs,
} from "antd";
import { motion } from "framer-motion";
import { CiCircleInfo } from "react-icons/ci";
import { MdOutlinePolicy, MdOutlineRateReview } from "react-icons/md";
import "../../assets/product.css";
import { useCart } from "../../contexts/cart.context";
import CommentComponent from "../../components/comment/comment";

const UserProductPage = () => {
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const increment = () => {
    if (product.stock !== 0 && count < product.stock) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const decrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  useEffect(() => {
    fetchProductDetail();
  }, [name]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const filter = {
        name: name,
        populate: "category,discounts,brand",
      };
      const res = await getProductByQuyeryAPI(1, 1, filter);
      const productData = res.data.result[0];

      if (!productData) {
        throw new Error("Sản phẩm không tồn tại");
      }

      const price = productData.price;
      const formattedPrice = productData.price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      const discountedPrice =
        price - (price * (productData.decreases || 0)) / 100;
      const formattedDiscountedPrice = discountedPrice.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      const images =
        productData.images?.length > 0
          ? productData.images.map(
              (img) =>
                `${import.meta.env.VITE_BACKEND_URL}/images/product/${img.name}`
            )
          : [`${import.meta.env.VITE_BACKEND_URL}/images/default/default.jpg`];

      setProduct({
        id: productData._id,
        name: productData.name,
        price: formattedPrice,
        rawPrice: price, // Giá gốc để tính toán
        discountedPrice: formattedDiscountedPrice,
        rawDiscountedPrice: discountedPrice, // Giá sau giảm để tính toán
        decreases: productData.decreases,
        ratings: productData.ratings || 0,
        reviews: productData.reviews?.length || 0,
        totalReviews: productData.totalReviews || 0,
        sold: productData.sold || 0,
        stock: productData.stock,
        color: productData.color || [],
        images,
        description: productData.description || "Chưa có mô tả",
        category: productData.category?.name || "Chưa có danh mục",
        brand: productData.brand?.name || "Chưa có thương hiệu",
        dimensions: productData.dimensions || "Chưa có kích thước",
        weight: productData.weight || "Chưa có cân nặng",
        material: productData.material || "Chưa có chất liệu",
      });

      if (productData.color?.length > 0) {
        setSelectedColor(productData.color[0]);
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm", error);
      notification.error({
        message: "Lỗi lấy chi tiết sản phẩm",
        description: error.message || "Đã có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailClick = (index) => {
    if (carouselRef.current) {
      setCurrentSlide(index);
      carouselRef.current.goTo(index);
    }
  };

  const handleAddToCart = async (product) => {
    if (product.stock === 0) {
      notification.error({
        message: "Hết hàng",
        description: `${product.name} hiện đã hết hàng!`,
      });
      return;
    }

    if (!selectedColor && product.color.length > 0) {
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
    } catch (error) {
      notification.error({
        message: "Lỗi thêm vào giỏ hàng",
        description: error.message || "Đã có lỗi xảy ra",
      });
    }
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      notification.error({
        message: "Hết hàng",
        description: `${product.name} hiện đã hết hàng!`,
      });
      return;
    }

    if (!selectedColor && product.color.length > 0) {
      notification.error({
        message: "Chưa chọn màu",
        description: "Vui lòng chọn màu trước khi mua ngay!",
      });
      return;
    }

    // Lưu thông tin sản phẩm vào localStorage
    const buyNowProduct = {
      id: product.id,
      name: product.name,
      rawPrice: product.rawPrice,
      rawDiscountedPrice: product.rawDiscountedPrice,
      quantity: count,
      color: selectedColor,
      image: product.images[0],
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(buyNowProduct));

    // Chuyển hướng đến /checkout/:id
    navigate(`/checkout/${product.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10">Sản phẩm không tồn tại</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 sm:px-6 lg:px-8"
    >
      <Row gutter={[32, 32]} className="mb-10">
        <Col xs={24} md={15}>
          <Carousel
            autoplay
            dots={{ className: "carousel-dots" }}
            className="rounded-lg overflow-hidden shadow-md"
            ref={carouselRef}
          >
            {product.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-[35rem] object-cover"
                  onError={(e) =>
                    (e.target.src = "/images/default/default.jpg")
                  }
                />
              </div>
            ))}
          </Carousel>
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                  currentSlide === index ? "border-blue-500" : "border-gray-200"
                } hover:border-blue-500 transition-all`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </Col>

        <Col xs={24} md={9}>
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <Rate
              allowHalf
              disabled
              value={product.ratings}
              style={{ fontSize: 16, colosr: "#fadb14" }}
            />
            <span className="ml-2 text-gray-500">
              ({product.totalReviews} đánh giá)
            </span>
            <span className="ml-4 text-gray-500">Đã bán {product.sold}</span>
          </div>

          <div className="mb-4 flex items-center space-x-4">
            {product.decreases && product.decreases > 0 ? (
              <>
                <span className="text-red-700 text-xl font-semibold bg-red-100 px-2 py-1 rounded">
                  -{product.decreases}%
                </span>
                <span className="text-red-500 text-3xl font-semibold">
                  {product.discountedPrice}
                </span>
                <span className="line-through text-gray-500 text-lg">
                  {product.price}
                </span>
              </>
            ) : (
              <span className="text-gray-700 text-3xl font-semibold">
                {product.price}
              </span>
            )}
          </div>

          <p className="mb-4 text-gray-700">
            <strong className="text-gray-700 text-lg">Danh mục:</strong>{" "}
            <span className=" text-lg">{product.category}</span>
          </p>

          <div className="mb-4 flex items-center">
            <strong className="text-gray-700 text-lg mr-2">Màu sắc:</strong>
            {product.color.length > 0 ? (
              product.color.map((c, i) => {
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
                    className={`inline-block w-4 h-4 rounded-full mr-2 border cursor-pointer hover:scale-150 transition-transform ${
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

          <p className="mb-4 text-gray-700">
            <strong className="text-gray-700 text-lg">Tồn kho:</strong>{" "}
            <span className=" text-lg">{product.stock}</span>
          </p>

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
                max={product.stock}
                onChange={(e) => {
                  if (product.stock !== 0) {
                    const value = parseInt(e.target.value) || 1;
                    const newValue = Math.min(
                      Math.max(1, value),
                      product.stock
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
                disabled={count >= product.stock}
                className={`px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${
                  count >= product.stock || product.stock === 0
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

          <div className="flex space-x-4">
            <Button
              className="w-40 h-12 font-semibold rounded-md"
              variant="solid"
              color="danger"
              onClick={() => handleAddToCart(product)}
            >
              THÊM VÀO GIỎ
            </Button>

            <Button
              className="w-40 h-12 font-semibold rounded-md btn-pay"
              variant="solid"
              color="primary"
              onClick={handleBuyNow}
            >
              MUA NGAY
              <span>CẢM ƠN QUÝ KHÁCH</span>
            </Button>
          </div>
        </Col>
      </Row>

      <Tabs
        className="w-full"
        size="large"
        defaultActiveKey="des"
        items={[
          {
            key: "des",
            label: (
              <span className="flex items-center space-x-2">
                <CiCircleInfo size={20} /> <span>Mô tả</span>
              </span>
            ),
            children: (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                  <strong className="text-lg text-gray-900">Mô tả:</strong>
                  <p className="text-gray-700 mt-1">{product.description}</p>
                </div>
                <div className="mb-4">
                  <strong className="text-lg text-gray-900">
                    Thương hiệu:
                  </strong>
                  <p className="text-gray-700 mt-1">{product.brand}</p>
                </div>
                <div className="mb-4">
                  <strong className="text-lg text-gray-900">Kích thước:</strong>
                  <p className="text-gray-700 mt-1">
                    {product.dimensions &&
                    typeof product.dimensions === "object"
                      ? `${product.dimensions.length || "N/A"} x ${
                          product.dimensions.width || "N/A"
                        } x ${product.dimensions.height || "N/A"} cm`
                      : product.dimensions || "Chưa có kích thước"}
                  </p>
                </div>
                <div className="mb-4">
                  <strong className="text-lg text-gray-900">Cân nặng:</strong>
                  <p className="text-gray-700 mt-1">{product.weight}</p>
                </div>
                <div className="mb-4">
                  <strong className="text-lg text-gray-900">Chất liệu:</strong>
                  <p className="text-gray-700 mt-1">{product.material}</p>
                </div>
              </div>
            ),
          },
          {
            key: "review",
            label: (
              <span className="flex items-center space-x-2">
                <MdOutlineRateReview size={20} /> <span>Đánh giá</span>
              </span>
            ),
            children: (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <CommentComponent product={product} />
              </div>
            ),
          },
          {
            key: "policy",
            label: (
              <span className="flex items-center space-x-2">
                <MdOutlinePolicy size={20} /> <span>Chính sách</span>
              </span>
            ),
            children: (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <p className="text-gray-700">
                  - Bảo hành 12 tháng. <br />
                  - Đổi trả trong 30 ngày nếu sản phẩm lỗi. <br />- Miễn phí vận
                  chuyển cho đơn hàng trên 500.000 VNĐ.
                </p>
              </div>
            ),
          },
        ]}
      />
    </motion.div>
  );
};

export default UserProductPage;
