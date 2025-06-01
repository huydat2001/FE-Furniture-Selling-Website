import { Button, Flex, Popover, Progress, Rate, Typography } from "antd";
import { green, lime, orange, red, yellow } from "@ant-design/colors";
import { QuestionOutlined } from "@ant-design/icons";
import { Card } from "../../components/card/card";
import { useEffect, useState } from "react";
import { getAllRatingsDistribution } from "../../services/api.service.comment";
import { Link } from "react-router-dom";

const PROGRESS_PROPS = {
  style: {
    width: 300,
  },
};

export const CustomerReviewsCard = (props) => {
  const [ratingsData, setRatingsData] = useState({
    totalRatings: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await getAllRatingsDistribution();
        console.log("response :>> ", response);
        // Ensure the response has the expected structure
        if (response?.data?.result) {
          setRatingsData({
            totalRatings: response.data.result.totalRatings || 0,
            distribution: response.data.result.distribution || {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching ratings distribution:", error);
      }
    };
    fetchRatings();
  }, []);

  const ratingLabels = {
    5: "Xuất sắc",
    4: "Tốt",
    3: "Khá ổn",
    2: "Tệ",
    1: "Rất tệ",
  };

  const ratingColors = {
    5: lime[6],
    4: green[5],
    3: yellow[6],
    2: orange[5],
    1: red[6],
  };

  // Calculate average rating safely
  const calculateAverageRating = () => {
    const dist = ratingsData.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    return Object.entries(dist).reduce(
      (sum, [rating, percentage]) => sum + Number(rating) * (percentage / 100),
      0
    );
  };

  return (
    <Card
      title="Đánh giá tổng quan của khách hàng"
      extra={
        <Popover
          content={`Overall rating of ${ratingsData.totalRatings} reviews`}
          title="Review ratings"
        >
          <Button icon={<QuestionOutlined />} size="small" type="text" />
        </Popover>
      }
      actions={[
        <Button>
          <Link to="/admin/comments">Xem tất cả đánh giá</Link>
        </Button>,
      ]}
      {...props}
    >
      <Flex vertical gap="middle">
        <Flex align="center" gap="middle" justify="center">
          <Rate allowHalf value={calculateAverageRating()} disabled />
          <Typography.Title level={2} style={{ margin: 0 }}>
            {calculateAverageRating().toFixed(1)}/5
          </Typography.Title>
        </Flex>
        <Flex vertical gap="small">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography.Text>{ratingLabels[rating]}</Typography.Text>
              <Progress
                percent={ratingsData.distribution?.[rating] || 0}
                strokeColor={ratingColors[rating]}
                {...PROGRESS_PROPS}
              />
            </div>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
};
