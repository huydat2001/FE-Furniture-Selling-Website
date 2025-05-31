import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  message,
  notification,
  Rate,
  Row,
  Tag,
  Tooltip,
} from "antd";
import Meta from "antd/es/card/Meta";
import { getProductByQuyeryAPI } from "../../../services/api.service.product";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FastDetailCompont from "./fast.detail";
import { useCart } from "../../../contexts/cart.context";
const ProductListComponent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { filter, badgeText, badgeColor } = props;

  useEffect(() => {
    fetchProducts();
  }, [filter]);
  const fetchProducts = async () => {
    try {
      const res = await getProductByQuyeryAPI(1, 12, filter);
      const listProduct = res.data.result;
      const formattedProducts = listProduct.map((product) => {
        const originalPrice = product.price;
        const originalDiscountedPrice =
          product.price - product.price * (product.decreases / 100 || 0);
        const price = product.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });

        const discountedPrice = (
          product.price -
          product.price * (product.decreases / 100 || 0)
        ).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        const discount = product.decreases
          ? `-${Math.round(product.decreases)}%`
          : null;

        const image =
          product.images?.length > 0
            ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                product.images[0].name
              }`
            : `${import.meta.env.VITE_BACKEND_URL}/images/default/default.jpg`;
        const imageHover =
          product.images?.length > 1
            ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                product.images[1].name
              }`
            : image;
        return {
          id: product._id,
          name: product.name,
          price,
          originalPrice,
          stock: product.stock,
          discountedPrice,
          originalDiscountedPrice,
          discount,
          decreases: product.decreases,
          rating: product.ratings || 0,
          totalReviews: product.totalReviews || 0,
          sold: product.sold || 0,
          color: product.color || [],
          image,
          imageHover,
        };
      });
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm", error);
      notification.error({
        message: "Lỗi lấy sản phẩm",
        description: error.message || "Đã có lỗi xảy ra",
      });
    }
  };
  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };
  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      notification.error({
        message: "Hết hàng",
        description: `${product.name} hiện đã hết hàng!`,
      });
      return;
    }

    addToCart({
      id: product.id,
      color: product.color,
    });
  };
  return (
    <>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <div className="transition-transform duration-300 hover:scale-105">
              <Badge.Ribbon text={badgeText} color={badgeColor}>
                <Card
                  hoverable
                  className="relative product-card"
                  style={{ width: "100%", cursor: "pointer" }} // Thêm cursor pointer
                  onClick={() => handleViewDetail(product.name)}
                  cover={
                    <div className="relative image-container">
                      <img
                        alt={product.name}
                        src={product.image}
                        loading="lazy"
                        className="image-default w-full h-48 object-cover"
                      />
                      <img
                        alt={product.name}
                        src={product.imageHover}
                        loading="lazy"
                        className="image-hover w-full h-48 object-cover"
                      />
                      <div className="button-container">
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          Thêm vào giỏ
                        </Button>
                        <Tooltip placement="top" title="Xem nhanh">
                          <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsModalOpen(true);
                              setSelectedProduct(product);
                            }}
                          />
                        </Tooltip>
                      </div>
                      {product.discount && (
                        <Tag
                          color="red"
                          className="absolute top-2 left-2 font-semibold"
                        >
                          {product.discount}
                        </Tag>
                      )}
                    </div>
                  }
                >
                  <Meta
                    title={
                      <span className="text-sm font-medium truncate block">
                        {product.name}
                      </span>
                    }
                    description={
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            {product.decreases && product.decreases > 0 ? (
                              <>
                                <span className="text-red-500 font-semibold text-lg">
                                  {product.discountedPrice}
                                </span>
                                <span className="line-through text-gray-500 ml-4 text-sm">
                                  {product.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-black font-semibold text-lg">
                                {product.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">
                          Đã bán {product.sold}
                        </span>
                        <div className="flex items-center">
                          <Rate
                            allowHalf
                            disabled
                            defaultValue={product.rating}
                            style={{ fontSize: 14 }}
                          />
                          <span className="ml-2 text-gray-500">
                            ({product.totalReviews} đánh giá)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm mr-2">Màu sắc:</span>
                          {product.color.length > 0
                            ? product.color.map((c, i) => {
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
                                const tagColor =
                                  colorMap[normalizedColor] || normalizedColor;

                                return (
                                  <span
                                    key={i}
                                    className="inline-block w-4 h-4 rounded-full mr-2 transition-transform duration-300 hover:scale-125"
                                    style={{ backgroundColor: tagColor }}
                                  />
                                );
                              })
                            : "Chưa cập nhật"}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </div>
          </Col>
        ))}
      </Row>
      <FastDetailCompont
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedProduct={selectedProduct}
        products={products}
      />
    </>
  );
};

export default ProductListComponent;
