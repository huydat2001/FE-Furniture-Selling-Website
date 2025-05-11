import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  getAllOrderAPI,
  updateOrderAPI,
} from "../../services/api.service.order";
import {
  Tabs,
  Table,
  Tag,
  Button,
  Image,
  Drawer,
  Descriptions,
  List,
  notification,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";

const HistoryOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Lấy danh sách đơn hàng khi component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      let userId = null;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.id || decoded._id || decoded.sub;
      } catch (error) {
        console.log("Token decode error:", error);
        userId = null;
      }

      const res = await getAllOrderAPI(null, null, { user: userId });
      if (res && res.data && Array.isArray(res.data.result)) {
        setOrders(res.data.result);
      } else {
        setOrders([]);
        console.warn(
          "No valid order data found, setting orders to empty array"
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở Drawer và lưu đơn hàng được chọn
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  // Hàm đóng Drawer
  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedOrder(null);
  };
  const handleCancelOrder = async (orderId, newStatus) => {
    const res = await updateOrderAPI({
      id: orderId,
      status: newStatus,
    });
    if (res.data) {
      notification.success({
        message: "Hủy thành công",
        description: "Trạng thái đơn hàng đã được cập nhật.",
      });
      fetchOrders(); // Làm mới bảng
    } else {
      notification.error({
        message: "Cập nhật thất bại",
        description: res.error.message || "Không thể cập nhật trạng thái.",
      });
    }
  };
  // Định nghĩa các cột cho bảng (desktop)
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "displayCode",
      key: "displayCode",
      responsive: ["md"],
      render: (text, record) => (
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => showOrderDetails(record)}
        >
          {text || record._id}
        </span>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      responsive: ["md"],
      render: (products) => (
        <ul className="list-disc list-inside">
          {products.map((item) => {
            const firstImage =
              item.product.images && item.product.images.length > 0
                ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                    item.product.images[0].name
                  }`
                : `${
                    import.meta.env.VITE_BACKEND_URL
                  }/images/default/default.png`;
            return (
              <li key={item._id} className="flex items-start space-x-2 mt-2">
                <Image
                  src={firstImage}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="object-cover rounded"
                />
                <div className="flex flex-col">
                  <Link
                    to={`/product/${item.product.name}`}
                    className="text-blue-500"
                  >
                    {item.product.name}
                  </Link>
                  <p>Số lượng: {item.quantity}</p>
                  <p>Giá: {item.price.toLocaleString("vi-VN")} VNĐ</p>
                </div>
              </li>
            );
          })}
        </ul>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"],
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      responsive: ["md"],
      render: (amount) =>
        amount ? `${amount.toLocaleString("vi-VN")} VNĐ` : "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      responsive: ["md"],
      render: (status) => {
        const statusMap = {
          pending: { label: "Chờ xác nhận", color: "#bfbfbf" },
          processing: { label: "Đang xử lý", color: "#2f54eb" },
          shipped: { label: "Đang vận chuyển", color: "#fa8c16" },
          delivered: { label: "Hoàn thành", color: "#52c41a" },
          cancelled: { label: "Đã hủy", color: "#f5222d" },
        };
        const { label, color } = statusMap[status] || {
          label: "Không xác định",
          color: "default",
        };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      responsive: ["md"],
      render: (_, record) => (
        <>
          {record.status === "pending" || record.status === "processing" ? (
            <Popconfirm
              title="Xác nhận hủy đơn"
              // description="Chắc chắn xóa?"
              onConfirm={() => handleCancelOrder(record._id, "cancelled")}
              okText="Hủy"
              cancelText="Thoát"
              placement="left"
            >
              <Button className="text-red-500">Hủy đơn</Button>
            </Popconfirm>
          ) : (
            <Button
              className="text-blue-500"
              onClick={() => showOrderDetails(record)}
            >
              Chi tiết
            </Button>
          )}
        </>
      ),
    },
  ];

  // Lọc đơn hàng theo trạng thái
  const getFilteredOrders = (status) => {
    if (!Array.isArray(orders)) {
      console.warn("Orders is not an array, returning empty array");
      return [];
    }
    if (status === "All") return orders;
    return orders.filter((order) => order.status === status);
  };

  // Định nghĩa các tab
  const items = [
    {
      key: "All",
      label: "Tất cả",
      children: (
        <>
          {/* Bảng cho desktop */}
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={getFilteredOrders("All")}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="shadow-md rounded-lg"
            />
          </div>
          {/* Danh sách cho mobile */}
          <div className="md:hidden">
            <List
              dataSource={getFilteredOrders("All")}
              renderItem={(order) => {
                const firstProduct = order.products[0];
                const firstImage =
                  firstProduct.product.images &&
                  firstProduct.product.images.length > 0
                    ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                        firstProduct.product.images[0].name
                      }`
                    : `${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/default/default.png`;
                const statusLabel =
                  {
                    pending: "Chờ xác nhận",
                    processing: "Đang xử lý",
                    shipped: "Đang vận chuyển",
                    delivered: "Hoàn thành",
                    cancelled: "Đã hủy",
                  }[order.status] || "Không xác định";
                const statusColor =
                  {
                    pending: "#bfbfbf",
                    processing: "#2f54eb",
                    shipped: "#fa8c16",
                    delivered: "#52c41a",
                    cancelled: "#f5222d",
                  }[order.status] || "default";

                return (
                  <div className="border-b p-4 bg-white shadow-sm rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                      </span>
                      <Tag color={statusColor}>{statusLabel}</Tag>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={firstImage}
                        alt={firstProduct.product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                        preview={false}
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${firstProduct.product.name}`}
                          className="text-blue-500 font-medium"
                        >
                          {firstProduct.product.name}
                        </Link>
                        <p>Số lượng: x{firstProduct.quantity}</p>
                        <p className="text-gray-700">
                          Giá: {firstProduct.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Tổng: {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <Button
                          className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => showOrderDetails(order)}
                        >
                          Chi tiết
                        </Button>
                        {(order.status === "pending" ||
                          order.status === "processing") && (
                          <Button className="mt-2 text-red-500">Hủy đơn</Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}
              loading={loading}
            />
          </div>
        </>
      ),
    },
    {
      key: "pending",
      label: "Chờ xác nhận",
      children: (
        <>
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={getFilteredOrders("pending")}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="shadow-md rounded-lg"
            />
          </div>
          <div className="md:hidden">
            <List
              dataSource={getFilteredOrders("pending")}
              renderItem={(order) => {
                const firstProduct = order.products[0];
                const firstImage =
                  firstProduct.product.images &&
                  firstProduct.product.images.length > 0
                    ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                        firstProduct.product.images[0].name
                      }`
                    : `${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/default/default.png`;
                const statusLabel =
                  {
                    pending: "Chờ xác nhận",
                    processing: "Đang xử lý",
                    shipped: "Đang vận chuyển",
                    delivered: "Hoàn thành",
                    cancelled: "Đã hủy",
                  }[order.status] || "Không xác định";
                const statusColor =
                  {
                    pending: "#bfbfbf",
                    processing: "#2f54eb",
                    shipped: "#fa8c16",
                    delivered: "#52c41a",
                    cancelled: "#f5222d",
                  }[order.status] || "default";

                return (
                  <div className="border-b p-4 bg-white shadow-sm rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                        Đã {statusLabel.toLowerCase()}
                      </span>
                      <Tag color={statusColor}>{statusLabel}</Tag>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={firstImage}
                        alt={firstProduct.product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                        preview={false}
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${firstProduct.product.name}`}
                          className="text-blue-500 font-medium"
                        >
                          {firstProduct.product.name}
                        </Link>
                        <p>Số lượng: x{firstProduct.quantity}</p>
                        <p className="text-gray-700">
                          Giá: {firstProduct.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Tổng: {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <Button
                          className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => showOrderDetails(order)}
                        >
                          Chi tiết
                        </Button>
                        <Button className="mt-2 text-red-500">Hủy đơn</Button>
                      </div>
                    </div>
                  </div>
                );
              }}
              loading={loading}
            />
          </div>
        </>
      ),
    },
    {
      key: "processing",
      label: "Đang xử lý",
      children: (
        <>
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={getFilteredOrders("processing")}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="shadow-md rounded-lg"
            />
          </div>
          <div className="md:hidden">
            <List
              dataSource={getFilteredOrders("processing")}
              renderItem={(order) => {
                const firstProduct = order.products[0];
                const firstImage =
                  firstProduct.product.images &&
                  firstProduct.product.images.length > 0
                    ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                        firstProduct.product.images[0].name
                      }`
                    : `${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/default/default.png`;
                const statusLabel =
                  {
                    pending: "Chờ xác nhận",
                    processing: "Đang xử lý",
                    shipped: "Đang vận chuyển",
                    delivered: "Hoàn thành",
                    cancelled: "Đã hủy",
                  }[order.status] || "Không xác định";
                const statusColor =
                  {
                    pending: "#bfbfbf",
                    processing: "#2f54eb",
                    shipped: "#fa8c16",
                    delivered: "#52c41a",
                    cancelled: "#f5222d",
                  }[order.status] || "default";

                return (
                  <div className="border-b p-4 bg-white shadow-sm rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                        Đang {statusLabel.toLowerCase()}
                      </span>
                      <Tag color={statusColor}>{statusLabel}</Tag>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={firstImage}
                        alt={firstProduct.product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                        preview={false}
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${firstProduct.product.name}`}
                          className="text-blue-500 font-medium"
                        >
                          {firstProduct.product.name}
                        </Link>
                        <p>Số lượng: x{firstProduct.quantity}</p>
                        <p className="text-gray-700">
                          Giá: {firstProduct.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Tổng: {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <Button
                          className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => showOrderDetails(order)}
                        >
                          Chi tiết
                        </Button>
                        <Button className="mt-2 text-red-500">Hủy đơn</Button>
                      </div>
                    </div>
                  </div>
                );
              }}
              loading={loading}
            />
          </div>
        </>
      ),
    },
    {
      key: "shipped",
      label: "Đang vận chuyển",
      children: (
        <>
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={getFilteredOrders("shipped")}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="shadow-md rounded-lg"
            />
          </div>
          <div className="md:hidden">
            <List
              dataSource={getFilteredOrders("shipped")}
              renderItem={(order) => {
                const firstProduct = order.products[0];
                const firstImage =
                  firstProduct.product.images &&
                  firstProduct.product.images.length > 0
                    ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                        firstProduct.product.images[0].name
                      }`
                    : `${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/default/default.png`;
                const statusLabel =
                  {
                    pending: "Chờ xác nhận",
                    processing: "Đang xử lý",
                    shipped: "Đang vận chuyển",
                    delivered: "Hoàn thành",
                    cancelled: "Đã hủy",
                  }[order.status] || "Không xác định";
                const statusColor =
                  {
                    pending: "#bfbfbf",
                    processing: "#2f54eb",
                    shipped: "#fa8c16",
                    delivered: "#52c41a",
                    cancelled: "#f5222d",
                  }[order.status] || "default";

                return (
                  <div className="border-b p-4 bg-white shadow-sm rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                        Đang {statusLabel.toLowerCase()}
                      </span>
                      <Tag color={statusColor}>{statusLabel}</Tag>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={firstImage}
                        alt={firstProduct.product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                        preview={false}
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${firstProduct.product.name}`}
                          className="text-blue-500 font-medium"
                        >
                          {firstProduct.product.name}
                        </Link>
                        <p>Số lượng: x{firstProduct.quantity}</p>
                        <p className="text-gray-700">
                          Giá: {firstProduct.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Tổng: {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <Button
                          className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => showOrderDetails(order)}
                        >
                          Chi tiết
                        </Button>
                        <Button className="mt-2 text-red-500">Hủy đơn</Button>
                      </div>
                    </div>
                  </div>
                );
              }}
              loading={loading}
            />
          </div>
        </>
      ),
    },
    {
      key: "delivered",
      label: "Hoàn thành",
      children: (
        <>
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={getFilteredOrders("delivered")}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="shadow-md rounded-lg"
            />
          </div>
          <div className="md:hidden">
            <List
              dataSource={getFilteredOrders("delivered")}
              renderItem={(order) => {
                const firstProduct = order.products[0];
                const firstImage =
                  firstProduct.product.images &&
                  firstProduct.product.images.length > 0
                    ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                        firstProduct.product.images[0].name
                      }`
                    : `${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/default/default.png`;
                const statusLabel =
                  {
                    pending: "Chờ xác nhận",
                    processing: "Đang xử lý",
                    shipped: "Đang vận chuyển",
                    delivered: "Hoàn thành",
                    cancelled: "Đã hủy",
                  }[order.status] || "Không xác định";
                const statusColor =
                  {
                    pending: "#bfbfbf",
                    processing: "#2f54eb",
                    shipped: "#fa8c16",
                    delivered: "#52c41a",
                    cancelled: "#f5222d",
                  }[order.status] || "default";

                return (
                  <div className="border-b p-4 bg-white shadow-sm rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                        Đã {statusLabel.toLowerCase()}
                      </span>
                      <Tag color={statusColor}>{statusLabel}</Tag>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={firstImage}
                        alt={firstProduct.product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                        preview={false}
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${firstProduct.product.name}`}
                          className="text-blue-500 font-medium"
                        >
                          {firstProduct.product.name}
                        </Link>
                        <p>Số lượng: x{firstProduct.quantity}</p>
                        <p className="text-gray-700">
                          Giá: {firstProduct.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Tổng: {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <Button
                          className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => showOrderDetails(order)}
                        >
                          Chi tiết
                        </Button>
                        <Button className="mt-2 text-red-500">Hủy đơn</Button>
                      </div>
                    </div>
                  </div>
                );
              }}
              loading={loading}
            />
          </div>
        </>
      ),
    },
    {
      key: "cancelled",
      label: "Đã hủy",
      children: (
        <>
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={getFilteredOrders("cancelled")}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="shadow-md rounded-lg"
            />
          </div>
          <div className="md:hidden">
            <List
              dataSource={getFilteredOrders("cancelled")}
              renderItem={(order) => {
                const firstProduct = order.products[0];
                const firstImage =
                  firstProduct.product.images &&
                  firstProduct.product.images.length > 0
                    ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                        firstProduct.product.images[0].name
                      }`
                    : `${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/default/default.png`;
                const statusLabel =
                  {
                    pending: "Chờ xác nhận",
                    processing: "Đang xử lý",
                    shipped: "Đang vận chuyển",
                    delivered: "Hoàn thành",
                    cancelled: "Đã hủy",
                  }[order.status] || "Không xác định";
                const statusColor =
                  {
                    pending: "#bfbfbf",
                    processing: "#2f54eb",
                    shipped: "#fa8c16",
                    delivered: "#52c41a",
                    cancelled: "#f5222d",
                  }[order.status] || "default";

                return (
                  <div className="border-b p-4 bg-white shadow-sm rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                        Đã {statusLabel.toLowerCase()}
                      </span>
                      <Tag color={statusColor}>{statusLabel}</Tag>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={firstImage}
                        alt={firstProduct.product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                        preview={false}
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${firstProduct.product.name}`}
                          className="text-blue-500 font-medium"
                        >
                          {firstProduct.product.name}
                        </Link>
                        <p>Số lượng: x{firstProduct.quantity}</p>
                        <p className="text-gray-700">
                          Giá: {firstProduct.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Tổng: {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <Button
                          className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => showOrderDetails(order)}
                        >
                          Chi tiết
                        </Button>
                        <Button className="mt-2 text-red-500">Hủy đơn</Button>
                      </div>
                    </div>
                  </div>
                );
              }}
              loading={loading}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Lịch sử đơn hàng
      </h1>
      <Tabs
        defaultActiveKey="All"
        items={items}
        onChange={(key) => console.log("Tab changed:", key)}
        className="bg-white rounded-lg shadow-md"
        tabBarStyle={{ padding: "0 16px" }}
      />
      {/* Drawer hiển thị chi tiết đơn hàng */}
      {selectedOrder && (
        <Drawer
          title={`Chi tiết đơn hàng: ${selectedOrder.displayCode}`}
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          width={600}
          className="p-4"
        >
          <div className="space-y-6">
            {/* Thông tin chung của đơn hàng */}
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Mã đơn hàng">
                {selectedOrder.displayCode}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    {
                      pending: "#bfbfbf",
                      processing: "#2f54eb",
                      shipped: "#fa8c16",
                      delivered: "#52c41a",
                      cancelled: "#f5222d",
                    }[selectedOrder.status] || "default"
                  }
                >
                  {{
                    pending: "Chờ xác nhận",
                    processing: "Đang xử lý",
                    shipped: "Đang vận chuyển",
                    delivered: "Hoàn thành",
                    cancelled: "Đã hủy",
                  }[selectedOrder.status] || "Không xác định"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN")}{" "}
                {new Date(selectedOrder.createdAt).toLocaleTimeString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {selectedOrder.totalAmount.toLocaleString("vi-VN")} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedOrder.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : selectedOrder.paymentMethod.toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {`${selectedOrder.shippingAddress.fullName}, ${selectedOrder.shippingAddress.phone}, ${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.state}, ${selectedOrder.shippingAddress.city}`}
              </Descriptions.Item>
            </Descriptions>

            {/* Danh sách sản phẩm */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h3>
              <List
                dataSource={selectedOrder.products}
                renderItem={(item) => {
                  const firstImage =
                    item.product.images && item.product.images.length > 0
                      ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                          item.product.images[0].name
                        }`
                      : "https://via.placeholder.com/40x40.png?text=No+Image";
                  return (
                    <List.Item>
                      <div className="flex items-center space-x-4 w-full">
                        <Image
                          src={firstImage}
                          alt={item.product.name}
                          width={60}
                          height={60}
                          className="object-cover rounded"
                          preview={true}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p>
                            Số lượng: {item.quantity} - Giá:{" "}
                            {item.price.toLocaleString("vi-VN")} VNĐ
                          </p>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default HistoryOrderPage;
