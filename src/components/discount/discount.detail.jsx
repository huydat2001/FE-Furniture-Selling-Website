import { Descriptions, Drawer, Spin, Tag, Typography } from "antd";
const { Title, Text } = Typography;

const DiscountDetailComponent = (props) => {
  const { openDraw, setOpenDraw, dataDetail } = props;
  const getStatusTag = (status) => {
    let color, value;
    switch (status) {
      case "inactive":
        color = "orange";
        value = "Ngưng hoạt động";
        break;
      case "expired":
        color = "red";
        value = "Hết hạn";
        break;
      case "active":
      default:
        color = "green";
        value = "Hoạt động";
        break;
    }
    return <Tag color={color}>{value.toUpperCase()}</Tag>;
  };
  return (
    <>
      <Drawer
        title={
          <span style={{ fontSize: "20px" }}>Chi tiết phiếu giảm giá</span>
        }
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
              <Descriptions.Item label="Mã giảm giá">
                {dataDetail.code || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Kiểu giảm">
                {dataDetail.type === "percentage"
                  ? "Phần trăm"
                  : dataDetail.type === "fixed"
                  ? "Cố định"
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Giá trị giảm">
                {dataDetail.value
                  ? dataDetail.type === "percentage"
                    ? `${dataDetail.value}%`
                    : `${dataDetail.value.toLocaleString()} VNĐ`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {dataDetail.startDate
                  ? new Date(dataDetail.startDate).toLocaleString("vi-VN")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {dataDetail.endDate
                  ? new Date(dataDetail.endDate).toLocaleString("vi-VN")
                  : "Không giới hạn"}
              </Descriptions.Item>
              <Descriptions.Item label="Số lần sử dụng tối đa">
                {dataDetail.maxUses
                  ? dataDetail.maxUses.toLocaleString()
                  : "Không giới hạn"}
              </Descriptions.Item>
              <Descriptions.Item label="Số lần đã sử dụng">
                {dataDetail.usedCount
                  ? dataDetail.usedCount.toLocaleString()
                  : 0}
              </Descriptions.Item>
              <Descriptions.Item label="Giá trị đơn hàng tối thiểu">
                {dataDetail.minOrderValue
                  ? `${dataDetail.minOrderValue.toLocaleString()} VNĐ`
                  : "0 VNĐ"}
              </Descriptions.Item>
              <Descriptions.Item label="Sản phẩm áp dụng">
                {dataDetail.applicableProducts &&
                dataDetail.applicableProducts.length > 0
                  ? dataDetail.applicableProducts.join(", ")
                  : "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Áp dụng cho tất cả">
                {dataDetail.isApplicableToAll ? "Có" : "Không"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(dataDetail.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Đã xóa">
                {dataDetail.deleted ? "Có" : "Không"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dataDetail.createdAt
                  ? new Date(dataDetail.createdAt).toLocaleString("vi-VN")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {dataDetail.updatedAt
                  ? new Date(dataDetail.updatedAt).toLocaleString("vi-VN")
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </>
  );
};
export default DiscountDetailComponent;
