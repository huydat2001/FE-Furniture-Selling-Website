import { Card, Flex, Space, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { green, red } from "@ant-design/colors";
import CountUp from "react-countup";

export const RevenueCard = (props) => {
  const { title, value, diff, justify, height, ...others } = props;

  // Hàm định dạng giá trị dựa trên tiêu đề
  const formatValue = (title, value) => {
    if (title === "Tổng doanh thu") {
      return typeof value === "number" ? (
        <>
          <CountUp end={value} /> VND
        </>
      ) : (
        <span>{value} VND</span>
      );
    } else if (title.includes("Tỷ lệ")) {
      return typeof value === "number" ? (
        <>
          <CountUp end={value} />%
        </>
      ) : (
        <span>{value}%</span>
      );
    } else {
      // Các trường hợp khác (đơn hàng, số lượng, v.v.) giữ nguyên
      return typeof value === "number" ? (
        <CountUp end={value} />
      ) : (
        <span>{value}</span>
      );
    }
  };

  return (
    <Card {...others} style={{ height }}>
      <Flex
        vertical
        gap={justify ? 0 : "large"}
        justify={justify}
        style={{ height: height ? height - 60 : "auto" }}
      >
        <Typography.Text>{title}</Typography.Text>
        <Flex justify="space-between" align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>
            {formatValue(title, value)}
          </Typography.Title>
          <Space style={{ color: diff > 0 ? green[6] : red[5] }}>
            {diff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Typography.Text
              style={{
                color: diff > 0 ? green[6] : red[5],
                fontWeight: 500,
              }}
            >
              <CountUp end={diff} />%
            </Typography.Text>
          </Space>
        </Flex>
      </Flex>
    </Card>
  );
};
