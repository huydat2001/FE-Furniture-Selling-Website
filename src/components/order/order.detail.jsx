import { Descriptions, Drawer, Spin, Tag, Typography } from "antd";

const DetaiOrderComponent = (props) => {
  const { openDraw, setOpenDraw, dataDetail } = props;
  const getStatusTag = (status) => {
    const statusOptions = [
      { value: "pending", label: "Chờ xử lý", color: "#bfbfbf" },
      { value: "processing", label: "Đang xử lý", color: "#2f54eb" },
      { value: "shipped", label: "Đang giao", color: "#fa8c16" },
      { value: "delivered", label: "Đã giao", color: "#52c41a" },
      { value: "cancelled", label: "Đã hủy", color: "#f5222d" },
    ];

    const option = statusOptions.find((opt) => opt.value === status);
    if (!option) return null;
    return <Tag color={option.color}>{option.label.toUpperCase()}</Tag>;
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
            <Typography.Text type="secondary">Không có dữ liệu</Typography.Text>
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
              <Descriptions.Item label="Mã đơn hàng">
                {dataDetail.displayCode}
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">
                {dataDetail.shippingAddress
                  ? dataDetail.shippingAddress.fullName
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Số khách hàng">
                {dataDetail.shippingAddress
                  ? dataDetail.shippingAddress.phone
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {dataDetail.shippingAddress
                  ? `${dataDetail.shippingAddress.street || "Chưa có xã"} / ${
                      dataDetail.shippingAddress.state || "Chưa có huyện"
                    } / ${
                      dataDetail.shippingAddress.city || "Chưa có tỉnh/thành"
                    }`
                  : "Chưa có địa chỉ"}
              </Descriptions.Item>
              <Descriptions.Item label="Sản phẩm">
                {dataDetail.products?.length
                  ? (() => {
                      const productMap = dataDetail.products.reduce(
                        (acc, item) => {
                          const productName =
                            item.product?.name || "Không xác định";
                          const key = `${productName}_${item.price}`; // Nhóm theo cả tên và giá
                          if (!acc[key]) {
                            acc[key] = {
                              name: productName,
                              quantity: 0,
                              price: item.price,
                            };
                          }
                          acc[key].quantity += item.quantity;
                          return acc;
                        },
                        {}
                      );

                      return Object.values(productMap).map((item, index) => (
                        <div key={index}>
                          {item.quantity} x {item.name} –{" "}
                          {(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </div>
                      ));
                    })()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {dataDetail.createdAt
                  ? new Date(dataDetail.createdAt).toLocaleString("vi-VN")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {dataDetail.paymentMethod === "cod"
                  ? "Tiền mặt"
                  : dataDetail.paymentMethod === "vnpay"
                  ? "Thẻ ngân hàng"
                  : dataDetail.paymentMethod === "bank_account"
                  ? "Tài khoản ngân hàng"
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(dataDetail.status)}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </>
  );
};

export default DetaiOrderComponent;
