import { useState, useEffect } from "react";
import { Pie } from "@ant-design/charts";
import { getOrderCountByStatus } from "../../services/api.service.analytic";

const OrdersStatusChart = ({ period, startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Bắt đầu loading khi gọi API
        setError(null);
        const response = await getOrderCountByStatus({
          period,
          startDate,
          endDate,
        });
        if (
          response &&
          response.data &&
          response.data.statusCode &&
          Array.isArray(response.data.result)
        ) {
          setData(response.data.result || []);
        } else {
          setData([]);
          setError(
            response?.data?.error?.message || "Dữ liệu không hợp lệ từ server"
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Lỗi khi lấy dữ liệu");
      } finally {
        setLoading(false); // Kết thúc loading sau khi hoàn tất (thành công hoặc thất bại)
      }
    };
    fetchData();
  }, [period, startDate, endDate]);

  const config = {
    appendPadding: 10,
    data,
    angleField: "value", // Số lượng đơn hàng
    colorField: "type", // Sử dụng type để tạo màu mặc định
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
    legend: {
      position: "bottom",
      itemName: {
        formatter: (text, item) => item.value, // Hiển thị tên trạng thái
      },
    },
    loading: loading, // Hiển thị loading khi đang tải dữ liệu
  };

  return <Pie {...config} />;
};

export default OrdersStatusChart;
