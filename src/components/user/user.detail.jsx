import { Drawer, Descriptions, Typography, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserDetailComponent = (props) => {
  const { openDraw, setOpenDraw, userDetail } = props;

  return (
    <Drawer
      title={<span style={{ fontSize: "20px" }}>Chi tiết người dùng</span>}
      width="40vw" // Giữ chiều rộng 40% viewport
      onClose={() => setOpenDraw(false)}
      open={openDraw}
      styles={{
        header: {
          textAlign: "center",
          borderBottom: "1px solid #f0f0f0", // Thêm đường viền nhẹ
          paddingBottom: 8,
        },
        body: {
          padding: "24px", // Tăng padding cho nội dung
          background: "#fafafa", // Màu nền nhẹ
        },
      }}
    >
      {userDetail === null ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Không có dữ liệu</Text>
          <Spin tip="Đang tải..." />
        </div>
      ) : (
        <>
          {/* Avatar và tiêu đề */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "24px",
              padding: "16px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <UserOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
            <Title level={4} style={{ marginTop: "8px" }}>
              {userDetail.fullName || "Chưa có tên"}
            </Title>
            <Text type="secondary">{userDetail.email || "Chưa có email"}</Text>
          </div>

          {/* Thông tin chi tiết */}
          <Descriptions
            bordered
            column={1} // Một cột để dễ đọc
            size="small" // Giữ kích thước gọn gàng
            style={{
              label: { fontWeight: "bold", width: "150px" },
              content: { color: "#595959" },
            }} // Style cho nhãn và nội dung
          >
            <Descriptions.Item label="ID">{userDetail._id}</Descriptions.Item>
            <Descriptions.Item label="Tên đăng nhập">
              {userDetail.username || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Họ tên">
              {userDetail.fullName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {userDetail.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {userDetail.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {userDetail.address
                ? `${userDetail.address.street || "Chưa có xã"} / ${
                    userDetail.address.state || "Chưa có huyện"
                  } / ${userDetail.address.city || "Chưa có tỉnh/thành"}`
                : "Chưa có địa chỉ"}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Drawer>
  );
};

export default UserDetailComponent;
