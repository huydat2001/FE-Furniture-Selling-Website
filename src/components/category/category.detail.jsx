import { UserOutlined } from "@ant-design/icons";
import { Descriptions, Drawer, Spin, Typography, Tag } from "antd";
const { Title, Text } = Typography;

const CategoryDetailComponent = (props) => {
  const { openDraw, setOpenDraw, dataDetail, setDataDetail } = props;
  return (
    <>
      <Drawer
        title={<span style={{ fontSize: "20px" }}>Chi tiết danh mục</span>}
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
              <Descriptions.Item label="Tên danh mục">
                {dataDetail.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="mô tả">
                {dataDetail.description || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục cha">
                {dataDetail.parent?.name || "Không có danh mục cha"}
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
            </Descriptions>
          </>
        )}
      </Drawer>
    </>
  );
};
export default CategoryDetailComponent;
