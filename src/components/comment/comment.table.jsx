import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Badge, Image, Popconfirm, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import CommentDetailComponent from "./detail.comment";

// Hàm lấy viewedComments từ localStorage
const getStoredViewedComments = () => {
  const stored = localStorage.getItem("viewedComments");
  return stored ? JSON.parse(stored) : {};
};

const CommentTableComponent = (props) => {
  const [dataDetail, setDataDetail] = useState(null);
  const [openDraw, setOpenDraw] = useState(false);
  const [viewedComments, setViewedComments] = useState(
    getStoredViewedComments()
  );
  const [totalReviewss, setTotalReviewss] = useState(null);
  const {
    data,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loading,
    fetchProduct,
  } = props;
  // Lưu viewedComments vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("viewedComments", JSON.stringify(viewedComments));
  }, [viewedComments]);
  // Đồng bộ viewedComments khi data thay đổi
  useEffect(() => {
    setViewedComments((prev) => {
      const updated = { ...prev };
      data.forEach((product) => {
        if (updated[product._id] > (product.totalReviews || 0)) {
          updated[product._id] = product.totalReviews || 0; // Đảm bảo viewedComments không lớn hơn totalReviews
        }
      });
      return updated;
    });
  }, [data]);
  useEffect(() => {
    fetchProduct();
  }, [totalReviewss]);
  const onChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleViewComments = (record) => {
    setDataDetail(record);
    setOpenDraw(true);
    setViewedComments((prev) => ({
      ...prev,
      [record._id]: record.totalReviews || 0,
    }));
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
        <a className="text-blue-500" onClick={() => handleViewComments(record)}>
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
      render: (images, record) => {
        if (!images || images.length === 0 || !images[0]?.name) {
          return <span>N/A</span>;
        }
        const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/images/product/${
          images[0].name
        }`;
        const totalReviews = record.totalReviews || 0;
        const viewed = viewedComments[record._id] || 0;
        const newCommentCount = Math.max(0, totalReviews - viewed);

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
            }}
          >
            <Badge count={newCommentCount}>
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
            </Badge>
          </div>
        );
      },
    },
    {
      title: "Tổng đánh giá",
      dataIndex: "totalReviews",
      key: "totalReviews",
      width: "15%",
      align: "center",
      render: (totalReviews) => totalReviews || 0,
    },
    {
      title: "Đánh giá trung bình",
      dataIndex: "ratings",
      key: "ratings",
      width: "15%",
      align: "center",
      render: (ratings) => {
        return <>{ratings || 0}⭐</>;
      },
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
  ];

  return (
    <>
      <Table
        loading={loading}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px",
        }}
        rowKey="_id"
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
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} trên {total} hàng
            </div>
          ),
        }}
      />
      <CommentDetailComponent
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
        dataDetail={dataDetail}
        loading={loading}
        fetchProduct={fetchProduct}
        setViewedComments={setViewedComments} // Truyền setViewedComments
      />
    </>
  );
};

export default CommentTableComponent;
