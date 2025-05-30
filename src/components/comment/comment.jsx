import {
  Button,
  Divider,
  Flex,
  Modal,
  Progress,
  Rate,
  Pagination,
  Input,
  Spin,
} from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { message } from "antd";
import {
  getCommentsByProduct,
  createComment,
} from "../../services/api.service.comment";
import { motion } from "framer-motion";

const WriteComment = ({ productId, onCommentAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const desc = ["Tệ", "Kém", "Bình thường", "Tốt", "Tuyệt vời"];
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await createComment(
        { productId, content, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalOpen(false);
      setContent("");
      setRating(5);
      onCommentAdded();
      message.success("Đánh giá thành công");
    } catch (err) {
      console.log("err :>> ", err);
      message.error("Lỗi khi gửi đánh giá");
    }
  };

  return (
    <>
      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#333" }}>
            Đánh giá và nhận xét
          </span>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={
          <span style={{ color: "#fff", fontWeight: 500 }}>Gửi đánh giá</span>
        }
        cancelText={<span style={{ color: "#666", fontWeight: 500 }}>Hủy</span>}
        okButtonProps={{
          style: {
            background: "linear-gradient(90deg, #ff7a45, #ff9a5a)",
            borderRadius: 8,
            border: "none",
            padding: "6px 20px",
            boxShadow: "0 2px 8px rgba(255, 122, 69, 0.3)",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: 8,
            borderColor: "#d9d9d9",
          },
        }}
        style={{ borderRadius: 12 }}
        width={500}
      >
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#333",
                marginBottom: "10px",
              }}
            >
              Đánh giá chung
            </p>
            <Flex gap="middle" vertical align="center">
              <Rate
                tooltips={desc}
                onChange={setRating}
                value={rating}
                style={{ fontSize: "24px" }}
              />
              {rating ? (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#ff7a45",
                    fontWeight: 500,
                    marginTop: "8px",
                  }}
                >
                  {desc[rating - 1]}
                </span>
              ) : null}
            </Flex>
          </div>

          <div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#333",
                marginBottom: "10px",
              }}
            >
              Nhận xét của bạn
            </p>
            <Input.TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm (tối đa 500 ký tự)..."
              autoSize={{ minRows: 4, maxRows: 6 }}
              style={{
                width: "100%",
                borderRadius: 8,
                borderColor: "#d9d9d9",
                padding: "12px",
                fontSize: "14px",
                resize: "none",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
              maxLength={500}
              showCount
            />
          </div>
        </div>
      </Modal>
      <div className="mb-4">
        <p>Bạn đánh giá sao về sản phẩm này?</p>
      </div>
      <Button
        type="primary"
        style={{
          background: "linear-gradient(90deg, #ff7a45, #ff9a5a)",
          borderColor: "#ff7a45",
          fontWeight: 600,
          borderRadius: 12,
          padding: "8px 20px",
          boxShadow: "0 4px 12px rgba(255, 122, 69, 0.4)",
          transition: "all 0.3s ease",
        }}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={(e) =>
          (e.target.style.background =
            "linear-gradient(90deg, #ff9a5a, #ff7a45)")
        }
        onMouseLeave={(e) =>
          (e.target.style.background =
            "linear-gradient(90deg, #ff7a45, #ff9a5a)")
        }
      >
        ✨ Đánh giá ngay
      </Button>
    </>
  );
};

const CommentComponent = ({ product }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [allComments, setAllComments] = useState([]);
  const memoizedComments = useMemo(() => comments, [comments]);

  useEffect(() => {
    fetchComments();
    fetchAllComments();
  }, [product.id]);

  const fetchAllComments = async () => {
    try {
      const response = await getCommentsByProduct(1, null, product.id); // Lấy tất cả bình luận
      setAllComments(response.data?.result || []);
    } catch (err) {
      console.log("Error fetching all comments:", err);
    }
  };

  const fetchComments = useCallback(
    async (current = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const response = await getCommentsByProduct(
          current,
          pageSize,
          product.id
        );
        const comments = response.data?.result || [];
        const paginationData = response.data?.pagination || {};
        setComments(comments);
        setPagination({
          currentPage: paginationData.current_page || 1,
          limit: paginationData.limit || 10,
          total: paginationData.total || 0,
          totalPages: paginationData.total_pages || 1,
        });
      } catch (err) {
        message.error("Lỗi khi tải bình luận");
      } finally {
        setLoading(false);
      }
    },
    [product.id]
  );

  const handlePageChange = (page, pageSize) => {
    fetchComments(page, pageSize);
  };

  const onCommentAdded = () => {
    // Cập nhật lại cả danh sách phân trang và danh sách đầy đủ
    fetchComments(1, pagination.limit); // Tải lại danh sách theo phân trang
    fetchAllComments(); // Tải lại toàn bộ danh sách để tính ratingDistribution
  };

  const calculateRatingDistribution = useCallback((comments) => {
    const counts = [0, 0, 0, 0, 0];
    comments.forEach((comment) => {
      counts[5 - comment.rating]++;
    });
    const total = comments.length;
    return counts.map((count) =>
      total > 0 ? Math.round((count / total) * 100) : 0
    );
  }, []);

  const ratingDistribution = useMemo(
    () => calculateRatingDistribution(allComments),
    [allComments]
  );

  // Tính lại totalReviews từ allComments
  const totalReviews = useMemo(() => allComments.length, [allComments]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="font-semibold text-xl text-center">
        Đánh giá & nhận xét {product.name}
      </h1>
      <Divider />

      {/* Phần tổng quan */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: "20px" }}
      >
        <div>
          <p style={{ fontSize: "24px", color: "#000" }}>
            {product.ratings || 0}/5
          </p>
          <Rate disabled value={product.ratings || 0} />
          <p style={{ color: "#666" }}>{totalReviews} đánh giá</p>
        </div>
        <div>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} style={{ marginBottom: "5px", width: "200px" }}>
              <span style={{ marginRight: "10px" }}>
                {star}⭐{" "}
                <Progress
                  percent={ratingDistribution[5 - star]}
                  size="default"
                />
              </span>
            </div>
          ))}
        </div>
      </Flex>

      {/* Nút viết đánh giá */}
      <WriteComment productId={product.id} onCommentAdded={onCommentAdded} />

      <Divider />

      {/* Phần lọc */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
          Lọc theo
        </div>
        <Flex gap="small">
          <Button type="default">Tất cả</Button>
          <Button type="default">5⭐</Button>
          <Button type="default">4⭐</Button>
          <Button type="default">3⭐</Button>
          <Button type="default">2⭐</Button>
          <Button type="default">1⭐</Button>
        </Flex>
      </div>

      <Divider />

      {/* Danh sách comment với container có chiều cao xác định */}
      <div style={{ minHeight: "400px", position: "relative" }}>
        {loading ? (
          <Spin
            spinning={loading}
            wrapperClassName="comment-loading-wrapper"
            style={{
              minHeight: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ height: "400px", width: "100%" }}></div>
          </Spin>
        ) : memoizedComments.length === 0 ? (
          <div
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Chưa có bình luận nào.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {memoizedComments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginBottom: "15px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #e8e8e8",
                }}
              >
                <Flex justify="space-between" align="center">
                  <div>
                    <div style={{ fontWeight: "bold", margin: 0 }}>
                      {comment.userId?.fullName || "Người dùng ẩn danh"}{" "}
                      <Rate
                        className="text-sm ml-2"
                        disabled
                        defaultValue={comment.rating}
                      />
                    </div>
                    <p className="my-2" style={{ color: "#666" }}>
                      {new Date(comment.createdAt).toLocaleString("vi-VN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </Flex>
                <p style={{ marginTop: "5px" }}>{comment.content}</p>
              </motion.div>
            ))}
            <Pagination
              current={pagination.currentPage}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;
