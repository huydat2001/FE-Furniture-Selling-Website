import {
  Alert,
  Button,
  Col,
  Flex,
  Image,
  notification,
  Popover,
  Progress,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Select,
  DatePicker,
} from "antd";
import { Area, Bullet, Pie } from "@ant-design/charts";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  QuestionOutlined,
  StarFilled,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;
import { useEffect, useState } from "react";
import { RevenueCard } from "../../components/revenueCard/revenue.card";
import { Card } from "../../components/card/card";
import CountUp from "react-countup";
import { CustomerReviewsCard } from "../../components/customerReview/customer.review.card";
import { getProductByQuyeryAPI } from "../../services/api.service.product";
import { getAllOrderAPI } from "../../services/api.service.order";
import {
  getCancellationRateAPI,
  getCurrentCustomersAPI,
  getProcessingOrdersAPI,
  getRevenueByPeriod,
  getTotalOrderAPI,
  getTotalRevenueAPI,
  getTotalSoldProductsAPI,
} from "../../services/api.service.analytic";
import SalesChart from "../../components/saleschart/sales.chart";
import OrdersStatusChart from "../../components/StatusOrderChart/status.order.chart";

const { Text, Title } = Typography;

// Định nghĩa UserAvatar tạm thời
const UserAvatar = ({ fullName }) => <span>{fullName}</span>;

// Định nghĩa numberWithCommas
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const PRODUCTS_COLUMNS = [
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
    render: (_, { name, images }) => {
      const firstImageName = images?.[0]?.name;
      const imageUrl = firstImageName
        ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${firstImageName}`
        : `${import.meta.env.VITE_BACKEND_URL}/images/default/default.jpg`;

      return (
        <Flex gap="small" align="center">
          <Image src={imageUrl} width={40} height={40} />
          <Text style={{ width: 160 }}>{name}</Text>
        </Flex>
      );
    },
  },
  {
    title: "Danh mục",
    dataIndex: ["category", "name"],
    key: "category",
    render: (text, record) => (
      <span className="text-capitalize">
        {record.category?.name || "Không có"}
      </span>
    ),
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (price) => price.toLocaleString("vi-VN") + " VNĐ" || "N/A",
  },
  {
    title: "TB đánh giá",
    dataIndex: "ratings",
    key: "ratings",
    render: (_, value) => {
      const sold = value.sold || 1; // Tránh chia cho 0
      const avg = value.ratings / sold;
      return (
        <Flex align="center" gap="small">
          {avg}
          <StarFilled style={{ fontSize: 12 }} />{" "}
        </Flex>
      );
    },
  },
];

const ORDERS_COLUMNS = [
  {
    title: "Mã đơn hàng",
    dataIndex: "displayCode",
    key: "displayCode",
  },
  {
    title: "Khách hàng",
    dataIndex: ["user", "username"],
    key: "username",
    render: (_) => <UserAvatar fullName={_} />,
  },
  {
    title: "Ngày đặt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => new Date(date).toLocaleString("vi-VN"),
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (totalAmount) =>
      totalAmount.toLocaleString("vi-VN") + " VNĐ" || "N/A",
  },
  {
    title: "Thanh toán",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
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
    title: "Số điện thoại",
    dataIndex: "shippingAddress",
    key: "phone",
    render: (shippingAddress) => shippingAddress?.phone || "N/A",
  },
];

const POPOVER_BUTTON_PROPS = {
  type: "text",
};

const cardStyles = {
  height: "100%",
};

const CustomerRateChart = () => {
  const data = [
    {
      title: "",
      ranges: [40, 70, 100],
      measures: [30, 70],
      target: 100,
    },
  ];

  const config = {
    data,
    measureField: "measures",
    rangeField: "ranges",
    targetField: "target",
    xField: "title",
    color: {
      range: ["#FFbcb8", "#FFe0b0", "#bfeec8"],
      measure: ["#5B8FF9", "#61DDAA"],
      target: "#39a3f4",
    },
    label: {
      measure: {
        position: "middle",
        style: { fill: "#fff" },
      },
    },
    xAxis: { line: null },
    yAxis: false,
    tooltip: { showMarkers: false, shared: true },
    legend: {
      custom: true,
      position: "bottom",
      items: [
        {
          value: "First time",
          name: "First time buying",
          marker: {
            symbol: "square",
            style: { fill: "#5B8FF9", r: 5 },
          },
        },
        {
          value: "Returning",
          name: "Returning",
          marker: {
            symbol: "square",
            style: { fill: "#61DDAA", r: 5 },
          },
        },
      ],
    },
  };

  return <Bullet {...config} />;
};

const AnalyticPage = ({ stylesContext }) => {
  const [products, setProducts] = useState([]);
  const [lowProducts, setLowProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState("day");
  const [rangeDate, setRangeDate] = useState(null);

  const [loading, setLoading] = useState({
    totalRevenue: false,
    totalOrders: false,
    cancelledOrder: false,
    totalSoldProduct: false,
    processingOrder: false,
    currentCustomers: false,
    products: false,
    orders: false,
    revenue: false,
  });
  const [error, setError] = useState({
    totalRevenue: null,
    totalOrders: null,
    cancelledOrder: null,
    totalSoldProduct: null,
    processingOrder: null,
    currentCustomers: null,
    products: null,
    orders: null,
    revenue: null,
  });
  const [totalRevenue, setTotalRevenue] = useState({ value: 0, diff: 0 });
  const [totalOrders, setTotalOrders] = useState({ value: 0, diff: 0 });
  const [cancelledOrder, setCancelledOrder] = useState({ value: 0, diff: 0 });
  const [totalSoldProduct, setTotalSoldProduct] = useState({
    value: 0,
    diff: 0,
  });
  const [processingOrder, setProcessingOrder] = useState({ value: 0, diff: 0 });
  const [currentCustomers, setCurrentCustomers] = useState({
    value: 0,
    diff: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const rowProps = stylesContext?.rowProps || {};

  useEffect(() => {
    fetchData();
  }, [period, rangeDate]);

  const fetchData = async () => {
    setLoading({
      totalRevenue: true,
      totalOrders: true,
      cancelledOrder: true,
      totalSoldProduct: true,
      processingOrder: true,
      currentCustomers: true,
      products: true,
      orders: true,
      revenue: true,
    });
    try {
      const periodParam = period || undefined;
      const startDateParam = rangeDate?.[0]?.format("YYYY-MM-DD");
      const endDateParam = rangeDate?.[1]?.format("YYYY-MM-DD");
      const revenueRes = await getRevenueByPeriod({
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });

      if (
        revenueRes?.data?.statusCode &&
        Array.isArray(revenueRes.data.result)
      ) {
        setRevenueData(revenueRes.data.result); // Lấy mảng result từ data
      } else {
        setError((prev) => ({
          ...prev,
          revenue:
            revenueRes?.data?.error?.message ||
            "Lỗi lấy dữ liệu doanh thu cho biểu đồ",
        }));
      }
      // Fetch total revenue
      const totalRevenueRes = await getTotalRevenueAPI({
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (totalRevenueRes.data) {
        setTotalRevenue(totalRevenueRes.data.result);
      } else {
        setError((prev) => ({
          ...prev,
          totalRevenue: "Lỗi lấy tổng doanh thu",
        }));
      }
      // Fetch total orders

      const totalOrdersRes = await getTotalOrderAPI({
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (totalOrdersRes.data) {
        setTotalOrders(totalOrdersRes.data.result);
      } else {
        setError((prev) => ({
          ...prev,

          totalOrders: "Lỗi lấy tổng số đơn hàng",
        }));
      }

      const cancelledOrdersRes = await getCancellationRateAPI({
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (cancelledOrdersRes.data) {
        setCancelledOrder(cancelledOrdersRes.data.result);
      } else {
        setError((prev) => ({
          ...prev,

          cancelledOrder: "Lỗi lấy tỷ lệ hủy đơn",
        }));
      }
      const totalSoldProductsRes = await getTotalSoldProductsAPI({
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (totalSoldProductsRes.data) {
        setTotalSoldProduct(totalSoldProductsRes.data.result);
      } else {
        setError((prev) => ({
          ...prev,

          totalSoldProduct: "Lỗi lấy số lượng sản phẩm đã bán",
        }));
      }
      const processingOrdersRes = await getProcessingOrdersAPI({
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (processingOrdersRes.data) {
        setProcessingOrder(processingOrdersRes.data.result);
      } else {
        setError((prev) => ({
          ...prev,

          processingOrder: "Lỗi lấy số lượng đơn đang xử lý",
        }));
      }
      const currentCustomersRes = await getCurrentCustomersAPI({
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (currentCustomersRes.data) {
        setCurrentCustomers(currentCustomersRes.data.result);
      } else {
        setError((prev) => ({
          ...prev,

          currentCustomers: "Lỗi lấy số lượng khách hàng",
        }));
      }
      // Fetch top products
      const productsRes = await getProductByQuyeryAPI(1, 10, {
        sortBy: "sold",
        order: "desc",
        populate: "category",
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (productsRes.data) {
        setProducts(productsRes.data.result);
      } else {
        setError((prev) => ({ ...prev, products: "Lỗi lấy top sản phẩm" }));
      }

      // Fetch low products
      const lowProductsRes = await getProductByQuyeryAPI(1, 10, {
        sortBy: "sold",
        order: "asc",
        populate: "category",
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (lowProductsRes.data) {
        setLowProducts(lowProductsRes.data.result);
      } else {
        setError((prev) => ({
          ...prev,
          products: "Lỗi lấy sản phẩm bán chậm",
        }));
      }

      // Fetch recent orders
      const ordersRes = await getAllOrderAPI(1, 10, {
        sortBy: "createdAt",
        order: "desc",
        period: periodParam,
        startDate: startDateParam,
        endDate: endDateParam,
      });
      if (ordersRes.data) {
        setOrder(ordersRes.data.result);
      } else {
        setError((prev) => ({ ...prev, orders: "Lỗi lấy đơn hàng" }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError({
        products: error.message,
        orders: error.message,
        categories: error.message,
        totalRevenue: error.message,
        totalOrders: error.message,
        revenue: error.message,
      });
      notification.error({
        message: "Lỗi lấy dữ liệu",
        description: error.message,
      });
    } finally {
      setLoading({
        totalRevenue: false,
        totalOrders: false,
        cancelledOrder: false,
        totalSoldProduct: false,
        processingOrder: false,
        currentCustomers: false,
        products: false,
        orders: false,
        revenue: false,
      });
    }
  };
  const topProducts = products;
  const topProductsError = error.products;
  const topProductsLoading = loading.products;

  const lowProductsError = error.products; // Sử dụng error.products vì lowProducts dùng cùng API
  const lowProductsLoading = loading.products;

  const recentOrders = order;
  const recentOrdersError = error.orders;
  const recentOrdersLoading = loading.orders;

  return (
    <div>
      <Row {...rowProps} gutter={[16, 16]}>
        <Col span={24}>
          <div className="flex justify-between">
            <Select
              value={period}
              onChange={(value) => setPeriod(value)}
              style={{ width: 120, marginBottom: 16 }}
            >
              <Select.Option value="day">Ngày</Select.Option>
              <Select.Option value="month">Tháng</Select.Option>
              <Select.Option value="year">Năm</Select.Option>
            </Select>
            <div>
              <RangePicker
                value={rangeDate}
                onChange={(dates) => {
                  setRangeDate(dates);
                  setPeriod(null); // Reset period khi chọn custom range
                }}
                format="YYYY-MM-DD"
              />
              <Button onClick={fetchData}>Lọc</Button>
            </div>
          </div>
        </Col>
        <Col sm={24} lg={16}>
          <Row {...rowProps}>
            <Col xs={24} sm={12}>
              <RevenueCard
                title="Tổng doanh thu"
                value={totalRevenue.value}
                diff={totalRevenue.diff}
                height={180}
                justify="space-between"
                loading={loading.totalRevenue}
              />
            </Col>
            <Col xs={24} sm={12}>
              <RevenueCard
                title="Tổng số đơn hàng"
                value={totalOrders.value}
                diff={totalOrders.diff}
                height={180}
                justify="space-between"
                loading={loading.totalOrders}
              />
            </Col>
            <Col xs={24} sm={12}>
              <RevenueCard
                title="Tổng sản phẩm đã bán"
                value={totalSoldProduct.value}
                diff={totalSoldProduct.diff}
                height={180}
                justify="space-between"
                loading={loading.totalSoldProduct}
              />
            </Col>
            <Col xs={24} sm={12}>
              <RevenueCard
                title="Tỷ lệ hủy đơn"
                value={cancelledOrder.value}
                diff={cancelledOrder.diff}
                height={180}
                justify="space-between"
                loading={loading.cancelledOrder}
              />
            </Col>
            <Col xs={24} sm={12}>
              <RevenueCard
                title="Đơn đang xử lý"
                value={processingOrder.value}
                diff={processingOrder.diff}
                height={180}
                justify="space-between"
                loading={loading.processingOrder}
              />
            </Col>
            <Col xs={24} sm={12}>
              <RevenueCard
                title="Khách hàng hiện tại"
                value={currentCustomers.value}
                diff={currentCustomers.diff}
                height={180}
                justify="space-between"
                loading={loading.currentCustomers}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={24} lg={8}>
          <CustomerReviewsCard />
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Tổng doanh thu"
            extra={
              <Popover content="Total sales over period x" title="Total sales">
                <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
              </Popover>
            }
            style={cardStyles}
          >
            <Flex vertical gap="middle">
              <Space>
                <Title level={3} style={{ margin: 0 }}>
                  <CountUp end={totalRevenue.value} /> VND
                </Title>

                <Tag
                  color={
                    totalRevenue.diff > 0 ? "green-inverse" : "red-inverse"
                  }
                  icon={
                    totalRevenue.diff > 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                >
                  {totalRevenue.diff}%
                </Tag>
              </Space>

              <SalesChart
                period={period}
                startDate={rangeDate?.[0]?.format("YYYY-MM-DD")}
                endDate={rangeDate?.[1]?.format("YYYY-MM-DD")}
                loading={loading.revenue}
              />

              {error.revenue && (
                <Alert
                  message="Lỗi"
                  description={error.revenue}
                  type="error"
                  showIcon
                />
              )}
            </Flex>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Trạng thái đơn hàng"
            extra={
              <Popover
                content="Số đơn theo trạng thái đơn hàng"
                title="Đơn hàng"
              >
                <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
              </Popover>
            }
            style={cardStyles}
          >
            <OrdersStatusChart
              period={period}
              startDate={rangeDate?.[0]?.format("YYYY-MM-DD")}
              endDate={rangeDate?.[1]?.format("YYYY-MM-DD")}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Sản phẩm bán chạy" style={cardStyles}>
            {topProductsError ? (
              <Alert
                message="Error"
                description={topProductsError}
                type="error"
                showIcon
              />
            ) : (
              <Table
                columns={PRODUCTS_COLUMNS}
                dataSource={topProducts}
                loading={topProductsLoading}
                className="overflow-scroll"
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Sản phẩm bán chậm" style={cardStyles}>
            {lowProductsError ? (
              <Alert
                message="Error"
                description={lowProductsError}
                type="error"
                showIcon
              />
            ) : (
              <Table
                columns={PRODUCTS_COLUMNS}
                dataSource={lowProducts}
                loading={lowProductsLoading}
                className="overflow-scroll"
              />
            )}
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Đơn hàng gần đây">
            {recentOrdersError ? (
              <Alert
                message="Error"
                description={recentOrdersError}
                type="error"
                showIcon
              />
            ) : (
              <Table
                columns={ORDERS_COLUMNS}
                dataSource={recentOrders}
                loading={recentOrdersLoading}
                className="overflow-scroll"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticPage;
