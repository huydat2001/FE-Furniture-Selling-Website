import { useState, useEffect } from "react";
import { Area } from "@ant-design/charts";
import { getRevenueByPeriod } from "../../services/api.service.analytic";

const SalesChart = ({ period, startDate, endDate, loading }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await getRevenueByPeriod({
          period,
          startDate,
          endDate,
        });
        if (response && response.data && response.data.statusCode) {
          setData(response.data.result || []);
        } else {
          setData([]); // Đặt dữ liệu rỗng nếu không hợp lệ
          setError(response?.data?.error?.message || "Lỗi không xác định");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [period, startDate, endDate]);
  const config = {
    data,
    xField: "date",
    yField: "value",
    seriesField: "country",
    slider: { start: 0.1, end: 0.9 },
    loading,
    ...(error && { error: <div style={{ color: "red" }}>{error}</div> }),
  };

  return <Area {...config} />;
};

export default SalesChart;
