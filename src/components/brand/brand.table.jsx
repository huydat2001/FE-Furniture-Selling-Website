import { useState } from "react";
import { deleteBrandAPI } from "../../services/api.service.brand";
import { Image, notification, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import BrandDetailComponent from "./brand.detail";
import BrandUpdateFormComponent from "./brand.update.form";

const BrandTableComponent = (props) => {
  const [openDraw, setOpenDraw] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const {
    data,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loading,
    fetchBrand,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    fileList,
    setFileList,
    uploadProps,
    uploadButton,
  } = props;
  const onChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const deleteBrand = async (id) => {
    const res = await deleteBrandAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa nhãn hàng thành công",
      });
      fetchBrand();
    } else {
      notification.error({
        message: "Xóa thất bại",
        description: `Xóa nhãn hàng thất bại`,
      });
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      align: "center",
      render: (_, record, index) => index + 1 + (current - 1) * pageSize,
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      key: "name",
      width: "15%",
      align: "center",
      render: (value, record) => (
        <a
          className="text-blue-500"
          onClick={() => {
            setDataDetail(record);
            setOpenDraw(true); // Mở drawer chi tiết
          }}
        >
          {value}
        </a>
      ),
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: "20%",
      align: "center",
      responsive: ["md"],
      render: (value) => {
        // Nếu không có logo, hiển thị placeholder hoặc "N/A"
        if (!value) {
          return <span>N/A</span>;
        }
        const imageUrl = `${
          import.meta.env.VITE_BACKEND_URL
        }/images/logo/${value}`;
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60px", // Chiều cao cố định cho ô
            }}
          >
            <Image
              src={imageUrl}
              alt="Logo"
              style={{
                maxWidth: "80px",
                maxHeight: "60px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: "4px",
                transition: "transform 0.2s ease",
              }}
              onError={(e) => {
                e.target.style.display = "none"; // Ẩn ảnh lỗi
                e.target.nextSibling.style.display = "block"; // Hiện placeholder
              }}
              onLoad={(e) => {
                e.target.style.display = "block";
                e.target.nextSibling.style.display = "none"; // Ẩn placeholder
              }}
            />
            <span
              style={{
                display: "none", // Ẩn mặc định
                color: "#999",
                fontSize: "14px",
              }}
            >
              Không tải được
            </span>
          </div>
        );
      },
    },
    {
      title: "Email liên hệ",
      dataIndex: "contactEmail",
      key: "contactEmail",
      width: "20%",
      align: "center",
      responsive: ["md"],

      render: (email) => email || "N/A",
    },
    {
      title: "Số điện thoại",
      dataIndex: "contactPhone",
      key: "contactPhone",
      width: "10%",
      align: "center",
      responsive: ["md"],

      render: (phone) => phone || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, { status }) => {
        let color, value;

        switch (status) {
          case "inactive":
            color = "orange";
            value = "Ngưng hoạt động";
            break;
          default: // "active"
            color = "green";
            value = "Hoạt động";
        }

        return (
          <Tag color={color} key={status}>
            {value.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: "5%",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <div style={{ display: "flex", gap: "20px" }}>
            <EditOutlined
              className="text-lg"
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                setDataDetail(record);
                setIsModalUpdateOpen(true); // Mở modal cập nhật
              }}
            />
            <Popconfirm
              className="text-lg"
              title="Confirm delete"
              description="Chắc chắn xóa?"
              onConfirm={() => deleteBrand(record._id)}
              okText="Có"
              cancelText="Không"
              placement="left"
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
          </div>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        loading={loading}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px",
        }}
        rowKey={"_id"}
        className="rounded-t-3xl rounded-b-2xl"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{
          position: ["bottomCenter"],
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          pageSizeOptions: ["5", "10", "20", "30"],
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} hàng
              </div>
            );
          },
        }}
      />
      <BrandDetailComponent
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
        dataDetail={dataDetail}
      />
      <BrandUpdateFormComponent
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        fetchBrand={fetchBrand}
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        fileList={fileList}
        setFileList={setFileList}
        uploadProps={uploadProps}
        uploadButton={uploadButton}
      />
    </>
  );
};
export default BrandTableComponent;
