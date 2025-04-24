import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";
import DiscountDetailComponent from "./discount.detail";
import { deleteDiscountAPI } from "../../services/api.serivice.discount";
import DiscountUpdateFormComponent from "./discount.update.form";

const DiscountTableComponent = (props) => {
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
    fetchDiscount,
    setCheck,
    check,
    checkType,
    setCheckType,
    getProduct,
    optionProduct,
    setOptionProduct,
  } = props;
  const onChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const deleteDiscount = async (id) => {
    const res = await deleteDiscountAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa phiếu giảm giá thành công",
      });
      fetchDiscount();
    } else {
      notification.error({
        message: "Xóa thất bại",
        description: `Xóa phiếu giảm giá thất bại`,
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
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      width: "25%",
      align: "center",
      render: (value, record) => (
        <a
          className="text-blue-500"
          onClick={() => {
            setDataDetail(record);
            setOpenDraw(true);
          }}
        >
          {value}
        </a>
      ),
    },
    {
      title: "Giá trị giảm",
      key: "value",
      dataIndex: "value",
      width: "20%",
      align: "center",
      render: (value, record) => {
        if (value === undefined || value === null) {
          return "N/A";
        } else {
          if (record.type === "fixed") {
            return `${value.toLocaleString()} VND`;
          }
          return `${value}%`;
        }
      },
    },
    {
      title: "Ngày bắt đầu",
      key: "startDate",
      dataIndex: "startDate",
      width: "25%",
      align: "center",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"), // Định dạng ngày
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      align: "center",
      render: (_, { status }) => {
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
          default:
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
                setIsModalUpdateOpen(true);
              }}
            />
            <Popconfirm
              className="text-lg"
              title="Confirm delete"
              description="Chắc chắn xóa?"
              onConfirm={() => deleteDiscount(record._id)}
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
      <DiscountDetailComponent
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
        dataDetail={dataDetail}
      />
      <DiscountUpdateFormComponent
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        fetchDiscount={fetchDiscount}
        check={check}
        setCheck={setCheck}
        checkType={checkType}
        setCheckType={setCheckType}
        getProduct={getProduct}
        optionProduct={optionProduct}
        setOptionProduct={setOptionProduct}
      />
    </>
  );
};
export default DiscountTableComponent;
