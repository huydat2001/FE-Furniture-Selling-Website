const getNew = async () => {
  try {
    const filter = {
      populate: "category,discounts",
    };
    const res = await getProductByQuyeryAPI(1, 10, filter);
    const listProduct = res.data.result;
    const formattedProducts = listProduct.map((product) => {
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
      // Lấy hình ảnh từ product.images
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
        discountedPrice,
        discount,
        decreases: product.decreases,
        rating: product.ratings || 0,
        reviews: product.reviews?.length || 0,
        sold: product.sold || 0,
        color: product.color || [], // Mảng màu sắc
        image,
        imageHover,
      };
    });
    setProducts(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
return (
  <>
    {/* CSS tùy chỉnh */}

    {/* cũ */}
    {/* Phần sản phẩm mới */}
    <div>
      <h1 className="text-4xl my-5 font-semibold">New</h1>

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
                        className="image-hover w-full h-48 object-cover"
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
    </div>
  </>
);
