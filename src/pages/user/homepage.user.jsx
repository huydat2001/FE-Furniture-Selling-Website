import { Card, Col, Row, Rate, Tag, Button, Input, Select, Badge } from "antd";
import Meta from "antd/es/card/Meta";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
{
  /* <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            onSearch={(value) => console.log("Search:", value)}
            style={{ maxWidth: "300px" }}
          />
          <Select
            placeholder="Lọc theo danh mục"
            options={[
              { value: "all", label: "Tất cả" },
              { value: "bedroom", label: "Phòng ngủ" },
              { value: "livingroom", label: "Phòng khách" },
            ]}
            onChange={(value) => console.log("Filter:", value)}
            style={{ width: "200px" }}
          />
        </div> */
}
const HomePage = () => {
  // Dữ liệu mẫu cho sản phẩm
  const products = [
    {
      id: 1,
      name: "Ghế Sofa MOHO HALDEN 801",
      price: "10,799,000đ",
      discountedPrice: "6,999,000đ",
      discount: "-35%",
      rating: 5,
      reviews: 1,
      sold: 10,
      color: "brown",
      image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      imageHover:
        "/image/pro_bo_ban_an_4_ghe_noi_that_moho_combo___1__acb02bb7ac8e4cc18193831d23504685_master.webp",
    },
    {
      id: 2,
      name: "Ghế Sofa MOHO HALDEN 80111111111111111111111111",
      price: "10,799,000đ",
      discountedPrice: "6,999,000đ",
      discount: "-35%",
      rating: 5,
      reviews: 1,
      sold: 10,
      color: "brown",
      image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      imageHover: "https://via.placeholder.com/300x300?text=Hover+Image",
    },
    {
      id: 3,
      name: "Ghế Sofa MOHO HALDEN 801",
      price: "10,799,000đ",
      discountedPrice: "6,999,000đ",
      discount: "-35%",
      rating: 5,
      reviews: 1,
      sold: 10,
      color: "brown",
      image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      imageHover: "https://via.placeholder.com/300x300?text=Hover+Image",
    },
    {
      id: 4,
      name: "Ghế Sofa MOHO HALDEN 801",
      price: "10,799,000đ",
      discountedPrice: "6,999,000đ",
      discount: "-35%",
      rating: 5,
      reviews: 1,
      sold: 10,
      color: "brown",
      image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      imageHover: "https://via.placeholder.com/300x300?text=Hover+Image",
    },
    {
      id: 5,
      name: "Ghế Sofa MOHO HALDEN 801",
      price: "10,799,000đ",
      discountedPrice: "6,999,000đ",
      discount: "-35%",
      rating: 5,
      reviews: 1,
      sold: 10,
      color: "brown",
      image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      imageHover: "https://via.placeholder.com/300x300?text=Hover+Image",
    },
  ];

  return (
    <>
      {/* CSS tùy chỉnh */}

      {/* cũ */}
      {/* Phần sản phẩm mới */}
      <div>
        <h1 className="text-3xl my-5">New</h1>
        <p className="mb-5">Nơi các sản phẩm mới xuất hiện</p>

        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              {/* Bọc Card và Badge.Ribbon trong div cha */}
              <div className="transition-transform duration-300 hover:scale-105">
                <Badge.Ribbon text="Mới" color="green">
                  <Card
                    hoverable
                    className="relative  product-card"
                    style={{ width: "100%" }}
                    cover={
                      <div className="relative image-container">
                        <img
                          alt={product.name}
                          src={product.image}
                          loading="lazy"
                          className="image-default w-full h-48 object-cover"
                        />
                        {/* Hình ảnh khi hover */}

                        <img
                          alt={product.name}
                          src={product.imageHover}
                          loading="lazy"
                          className="image-hover"
                        />
                        {/* Container chứa các nút */}

                        <div className="button-container">
                          <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            onClick={() =>
                              console.log("Thêm vào giỏ", product.id)
                            }
                          >
                            Thêm vào giỏ
                          </Button>

                          <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() =>
                              console.log("Xem chi tiết", product.id)
                            }
                          />
                        </div>
                        {/* Nhãn giảm giá */}
                        <Tag
                          color="red"
                          className="absolute top-2 left-2 font-semibold"
                        >
                          {product.discount}
                        </Tag>
                      </div>
                    }
                  >
                    {/* Tên sản phẩm */}
                    <Meta
                      title={
                        <span className="text-sm font-medium truncate block">
                          {product.name}
                        </span>
                      }
                      description={
                        <div className="flex flex-col space-y-2">
                          {/* Giá và trạng thái */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="line-through text-gray-500 mr-2 text-sm">
                                {product.price}
                              </span>
                              <span className="text-red-500 font-semibold text-lg">
                                {product.discountedPrice}
                              </span>
                            </div>
                          </div>
                          <span className="text-gray-500 text-sm">
                            Đã bán {product.sold}
                          </span>
                          {/* Đánh giá */}
                          <div className="flex items-center">
                            <Rate
                              disabled
                              defaultValue={product.rating}
                              style={{ fontSize: 14 }}
                            />
                            <span className="ml-2 text-gray-500">
                              ({product.reviews} đánh giá)
                            </span>
                          </div>
                          {/* Màu sắc */}
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Màu sắc:</span>
                            <span
                              className="inline-block w-4 h-4 rounded-full transition-transform duration-300 hover:scale-125"
                              style={{ backgroundColor: product.color }}
                            />
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
      </div>
    </>
  );
};

export default HomePage;
