import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Image,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useState } from "react";
import {
  cancelOrderAPI,
  deleteOrderAPI,
  updateOrderAPI,
} from "../../services/api.service.order";
import DetaiOrderComponent from "./order.detail";

const OrderTableComponent = (props) => {
  const [openDraw, setOpenDraw] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const {
    data,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loading,
    fetchOrder,
  } = props;
  const onChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const deleteOrder = async (id) => {
    const res = await deleteOrderAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa đơn hàng thành công",
      });
      fetchOrder();
    } else {
      notification.error({
        message: "Xóa thất bại",
        description: `Xóa đơn hàng thất bại`,
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
      title: "Mã đơn hàng",
      dataIndex: "displayCode",
      key: "displayCode",
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
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "10%",
      align: "center",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },

    {
      title: "Khách hàng",
      dataIndex: "shippingAddress",
      key: "fullName",
      width: "15%",
      align: "center",
      render: (shippingAddress) => shippingAddress?.fullName || "N/A",
    },
    {
      title: "Số điện thoại",
      dataIndex: "shippingAddress",
      key: "phone",
      width: "15%",
      align: "center",
      render: (shippingAddress) => shippingAddress?.phone || "N/A",
    },

    {
      title: "Số tiền thanh toán",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: "10%",
      align: "center",
      render: (amount) =>
        amount ? amount.toLocaleString("vi-VN") + " VNĐ" : "N/A",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: "15%",
      align: "center",
      render: (method) => {
        let value;
        switch (method) {
          case "cod":
            value = "Tiền mặt";
            break;
          case "vnpay":
            value = "Thẻ ngân hàng";
            break;
          case "bank_account":
            value = "Tài khoản ngân hàng";
            break;
          default:
            value = "N/A";
        }
        return <span>{value}</span>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      align: "center",
      render: (_, record) => {
        const statusOptions = [
          { value: "pending", label: "Chờ xử lý", color: "#bfbfbf" },
          { value: "processing", label: "Đang xử lý", color: "#2f54eb" },
          { value: "shipped", label: "Đang giao", color: "#fa8c16" },
          { value: "delivered", label: "Đã giao", color: "#52c41a" },
          { value: "cancelled", label: "Đã hủy", color: "#f5222d" },
        ];

        const handleStatusChange = async (newStatus) => {
          try {
            const response = await updateOrderAPI({
              id: record._id,
              status: newStatus,
            });

            if (response.data) {
              notification.success({
                message: "Cập nhật thành công",
                description: "Trạng thái đơn hàng đã được cập nhật.",
              });
              fetchOrder(); // Làm mới bảng
            } else {
              notification.error({
                message: "Cập nhật thất bại",
                description:
                  response.error.message || "Không thể cập nhật trạng thái.",
              });
            }
          } catch (error) {
            notification.error({
              message: "Lỗi hệ thống",
              description: "Đã xảy ra lỗi khi xử lý trạng thái đơn hàng.",
            });
            console.error("Lỗi khi cập nhật trạng thái:", error);
          }
        };

        const currentStatus = statusOptions.find(
          (option) => option.value === record.status
        );
        return (
          <Select
            value={record.status}
            onChange={handleStatusChange}
            style={{ width: "100%" }}
            className="border-hidden"
            placeholder="Chọn trạng thái"
          >
            {statusOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <Tag color={option.color}>{option.label.toUpperCase()}</Tag>
              </Select.Option>
            ))}
          </Select>
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
            <Popconfirm
              title="Confirm delete"
              description="Chắc chắn xóa?"
              onConfirm={() => deleteOrder(record._id)}
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
      <style>
        {`
          .border-hidden .ant-select-selector {
            border: none !important;
            box-shadow: none !important;
          }
    
        `}
      </style>
      <Table
        loading={loading}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px",
        }}
        rowKey={"_id"}
        className="overflow-scroll rounded-t-3xl rounded-b-2xl"
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
      <DetaiOrderComponent
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
        dataDetail={dataDetail}
      />
    </>
  );
};
export default OrderTableComponent;
