import { Image, notification, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";
import { deleteProductAPI } from "../../services/api.service.product";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ProductDetailComponent from "./product.detail";
import ProductUpdateFormComponent from "./product.update.form";

const ProductTableComponent = (props) => {
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
    fetchProduct,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    fileList,
    setFileList,
    uploadProps,
    uploadButton,
    //
    optionCategory,
    optionBrand,
    optionDiscount,
    //
    getBrand,
    getCategory,
    getDiscount,
  } = props;

  const onChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const deleteProduct = async (id) => {
    const res = await deleteProductAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa sản phẩm thành công",
      });
      fetchProduct();
    } else {
      notification.error({
        message: "Xóa thất bại",
        description: `Xóa sản phẩm thất bại`,
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
      title: "Tên sản phẩm",
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
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      width: "15%",
      align: "center",
      responsive: ["md"],
      render: (images) => {
        if (!images || images.length === 0 || !images[0]?.name) {
          return <span>N/A</span>;
        }
        const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/images/product/${
          images[0].name
        }`;
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
            }}
          >
            <Image
              src={imageUrl}
              alt="Product Image"
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
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
              onLoad={(e) => {
                e.target.style.display = "block";
                e.target.nextSibling.style.display = "none";
              }}
            />
            <span
              style={{
                display: "none",
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "10%",
      align: "center",
      render: (price) => price.toLocaleString("vi-VN") + " VNĐ" || "N/A",
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: "10%",
      align: "center",
      render: (stock) => (stock >= 0 ? stock : "Hết hàng"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
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
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: "15%",
      align: "center",
      render: (category) => category?.name || "N/A", // Giả định đã populate
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      width: "15%",
      align: "center",
      render: (brand) => brand?.name || "N/A", // Giả định đã populate
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      width: "10%",
      align: "center",
      render: (sold) => sold || 0,
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
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
              title="Confirm delete"
              description="Chắc chắn xóa?"
              onConfirm={() => deleteProduct(record._id)}
              okText="Có"
              cancelText="Không"
              placement="left"
            >
              <DeleteOutlined
                className="text-lg"
                style={{ cursor: "pointer", color: "red" }}
              />
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
      <ProductDetailComponent
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
        dataDetail={dataDetail}
      />
      <ProductUpdateFormComponent
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        fetchProduct={fetchProduct}
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        fileList={fileList}
        setFileList={setFileList}
        uploadProps={uploadProps}
        uploadButton={uploadButton}
        //
        optionCategory={optionCategory}
        optionBrand={optionBrand}
        optionDiscount={optionDiscount}
        //
        getBrand={getBrand}
        getCategory={getCategory}
        getDiscount={getDiscount}
      />
    </>
  );
};
export default ProductTableComponent;
