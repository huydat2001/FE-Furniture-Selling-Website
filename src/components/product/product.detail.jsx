import {
  Carousel,
  Descriptions,
  Drawer,
  Image,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";
const { Title, Text } = Typography;
const ProductDetailComponent = (props) => {
  const [errorImages, setErrorImages] = useState({});
  const { openDraw, setOpenDraw, dataDetail } = props;

  const renderImages = (images) => {
    if (!images || images.length === 0) {
      return <Text type="secondary">Không có hình ảnh</Text>;
    }
    return (
      <Carousel
        autoplay={{ dotDuration: true }}
        arrows
        infinite={false}
        style={{
          width: "90%",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {images.map((img, index) => {
          const imageUrl = `${
            import.meta.env.VITE_BACKEND_URL
          }/images/product/${img.name}`;
          const hasError = errorImages[imageUrl];
          return (
            <div
              key={img.public_id || index}
              style={{
                width: "100%",
                height: "400px", // Đảm bảo chiều cao cố định cho slide
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={hasError ? "/placeholder-image.jpg" : imageUrl}
                alt={`Product Image ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  display: "block",
                  margin: "0 auto",
                }}
                placeholder={<Spin />}
                onError={(e) => {
                  if (!errorImages[imageUrl]) {
                    // Chỉ log và cập nhật lỗi lần đầu tiên
                    console.error(`Không tìm thấy ảnh: ${imageUrl}`);
                    setErrorImages((prev) => ({ ...prev, [imageUrl]: true }));
                    e.target.src = "/placeholder-image.jpg";
                  }
                }}
              />
            </div>
          );
        })}
      </Carousel>
    );
  };
  return (
    <>
      {/* hello */}
      <Drawer
        title={<Title level={4}>Chi tiết sản phẩm</Title>}
        width="50vw"
        onClose={() => setOpenDraw(false)}
        open={openDraw}
        styles={{
          header: {
            textAlign: "center",
            borderBottom: "1px solid #e8e8e8",
            padding: "16px",
            background: "#fff",
          },
          body: {
            padding: "24px",
            background: "#fafafa",
          },
        }}
      >
        {!dataDetail ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin tip="Đang tải..." size="large" />
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Phần hình ảnh */}
            <div>
              <Title level={5} style={{ marginBottom: "16px" }}>
                Hình ảnh sản phẩm
              </Title>
              {renderImages(dataDetail.images)}
            </div>

            {/* Thông tin cơ bản */}
            <div>
              <Title level={5} style={{ marginBottom: "16px" }}>
                Thông tin cơ bản
              </Title>
              <Descriptions
                bordered
                column={1}
                size="middle"
                styles={{
                  label: {
                    width: "150px",
                    fontWeight: "bold",
                    background: "#f5f5f5",
                  },
                  content: { color: "#595959" },
                }}
              >
                <Descriptions.Item label="ID">
                  {dataDetail._id}
                </Descriptions.Item>
                <Descriptions.Item label="Tên sản phẩm">
                  {dataDetail.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {dataDetail.description || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {dataDetail.price
                    ? dataDetail.price.toLocaleString("vi-VN") + " VNĐ"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="% giảm ban đầu">
                  {dataDetail.decreases ? dataDetail.decreases + "%" : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Tồn kho">
                  {dataDetail.stock >= 0 ? dataDetail.stock : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Đã bán">
                  {dataDetail.sold >= 0 ? dataDetail.sold : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={dataDetail.status === "active" ? "green" : "volcano"}
                  >
                    {dataDetail.status === "active"
                      ? "HOẠT ĐỘNG"
                      : "NGƯNG HOẠT ĐỘNG"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Thông tin bổ sung */}
            <div>
              <Title level={5} style={{ marginBottom: "16px" }}>
                Thông tin bổ sung
              </Title>
              <Descriptions
                bordered
                column={1}
                size="middle"
                styles={{
                  label: {
                    width: "150px",
                    fontWeight: "bold",
                    background: "#f5f5f5",
                  },
                  content: { color: "#595959" },
                }}
              >
                <Descriptions.Item label="Danh mục">
                  {dataDetail.category?.name || dataDetail.category || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Thương hiệu">
                  {dataDetail.brand?.name || dataDetail.brand || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã giảm giá">
                  {dataDetail.discounts?.length > 0
                    ? dataDetail.discounts.map((d, i) => (
                        <Tag key={i} color="blue">
                          {d?.code || d}
                        </Tag>
                      ))
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Đánh giá">
                  {dataDetail.ratings > 0
                    ? `${dataDetail.ratings}/5`
                    : "Chưa có"}
                </Descriptions.Item>
                <Descriptions.Item label="Kích thước">
                  {dataDetail.dimensions
                    ? `${dataDetail.dimensions.length || "N/A"} x ${
                        dataDetail.dimensions.width || "N/A"
                      } x ${dataDetail.dimensions.height || "N/A"} cm`
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Cân nặng">
                  {dataDetail.weight ? `${dataDetail.weight} kg` : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Chất liệu">
                  {dataDetail.material || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Màu sắc">
                  {dataDetail.color?.length > 0
                    ? dataDetail.color.map((c, i) => {
                        // Chuyển đổi màu tiếng Việt thành màu hợp lệ cho Ant Design Tag
                        let tagColor = c;
                        if (c.toLowerCase() === "đỏ") tagColor = "red";
                        else if (c.toLowerCase() === "xanh") tagColor = "blue";
                        else if (c.toLowerCase() === "vàng")
                          tagColor = "yellow";
                        else if (c.toLowerCase() === "trắng")
                          tagColor = "white";
                        else if (c.toLowerCase() === "đen") tagColor = "black";
                        else if (c.toLowerCase() === "xám") tagColor = "gray";
                        else if (c.toLowerCase() === "tím")
                          tagColor = "magenta";
                        // Nếu không khớp với màu nào, để tagColor là giá trị gốc (có thể không hiển thị màu)

                        return (
                          <Tag key={i} color={tagColor}>
                            {c}
                          </Tag>
                        );
                      })
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Nổi bật">
                  <Tag color={dataDetail.isFeatured ? "gold" : "gray"}>
                    {dataDetail.isFeatured ? "CÓ" : "KHÔNG"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};
export default ProductDetailComponent;
