import { Descriptions, Drawer, Image, Spin, Tag, Typography } from "antd";
const { Title, Text } = Typography;

const BrandDetailComponent = (props) => {
  const { openDraw, setOpenDraw, dataDetail, setDataDetail } = props;
  return (
    <>
      <Drawer
        title={<span style={{ fontSize: "20px" }}>Chi tiết hãng</span>}
        width="40vw"
        onClose={() => setOpenDraw(false)}
        open={openDraw}
        styles={{
          header: {
            textAlign: "center",
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 8,
          },
          body: {
            padding: "24px",
            background: "#fafafa",
          },
        }}
      >
        {dataDetail === null ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Text type="secondary">Không có dữ liệu</Text>
            <Spin tip="Đang tải..." />
          </div>
        ) : (
          <>
            {/* Thông tin chi tiết */}
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{
                label: { fontWeight: "bold", width: "150px" },
                content: { color: "#595959" },
              }}
            >
              <Descriptions.Item label="ID">{dataDetail._id}</Descriptions.Item>
              <Descriptions.Item label="Tên thương hiệu">
                {dataDetail.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email liên hệ">
                {dataDetail.contactEmail || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại	">
                {dataDetail.contactPhone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={dataDetail.status === "active" ? "green" : "volcano"}
                >
                  {dataDetail.status === "active"
                    ? "Hoạt động"
                    : "Ngưng hoạt động"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Logo hãng">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "120px",
                    padding: "8px",
                    background: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  {dataDetail.logo ? (
                    <Image
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/logo/${
                        dataDetail.logo
                      }`}
                      alt="Logo hãng"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "120px",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                      onLoad={(e) => {
                        e.target.style.display = "block";
                        e.target.nextSibling.style.display = "none";
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    />
                  ) : (
                    <Text type="secondary">Không có hình ảnh</Text>
                  )}
                  <span
                    style={{
                      display: "none",
                      color: "#999",
                      fontSize: "14px",
                    }}
                  >
                    Không tải được ảnh
                  </span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </>
  );
};
export default BrandDetailComponent;
