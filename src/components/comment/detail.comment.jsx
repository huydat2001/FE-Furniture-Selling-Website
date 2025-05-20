import {
  Drawer,
  Spin,
  List,
  Rate,
  Button,
  Modal,
  message,
  Popconfirm,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import {
  getCommentsByProduct,
  deleteComment,
} from "../../services/api.service.comment";
import { DeleteOutlined } from "@ant-design/icons";

const CommentDetailComponent = (props) => {
  const [allComments, setAllComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const {
    openDraw,
    setOpenDraw,
    dataDetail,
    loading,
    fetchProduct,
    setViewedComments,
  } = props;

  useEffect(() => {
    if (dataDetail?._id) {
      fetchAllComments();
    }
  }, [dataDetail]);

  const fetchAllComments = async () => {
    setLoadingComments(true);
    try {
      const response = await getCommentsByProduct(1, 1000, dataDetail._id);
      setAllComments(response.data?.result || []);
    } catch (err) {
      console.log("Error fetching comments:", err);
      message.error("Lỗi khi tải bình luận");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      await fetchAllComments();
      await fetchProduct();
      // Cập nhật viewedComments để phản ánh số comment đã xem
      setViewedComments((prev) => ({
        ...prev,
        [dataDetail._id]: Math.max(0, (prev[dataDetail._id] || 0) - 1), // Giảm số comment đã xem
      }));
      message.success("Đã xóa bình luận thành công!");
    } catch (err) {
      console.log("Error deleting comment:", err);
      message.error("Lỗi khi xóa bình luận");
    }
  };

  // Hàm giả định để thêm comment (nếu bạn có chức năng này)
  const handleAddComment = async (newComment) => {
    try {
      // Giả định bạn có API để thêm comment
      await addComment(dataDetail._id, newComment); // Cần thêm API này
      await fetchAllComments();
      await fetchProduct();
      // Cập nhật viewedComments để phản ánh comment mới
      setViewedComments((prev) => ({
        ...prev,
        [dataDetail._id]: prev[dataDetail._id] || 0, // Không tăng viewedComments để badge count tăng
      }));
      message.success("Đã thêm bình luận thành công!");
    } catch (err) {
      console.log("Error adding comment:", err);
      message.error("Lỗi khi thêm bình luận");
    }
  };

  return (
    <Drawer
      title={<Title level={4}>Danh sách bình luận</Title>}
      width="50vw"
      onClose={() => setOpenDraw(false)}
      open={openDraw}
      styles={{
        header: {
          textAlign: "center",
          borderBottom: "1px solid #e8e8e8",
          padding: "16px",
          background: "#fff",
        },
        body: {
          padding: "24px",
          background: "#fafafa",
        },
      }}
    >
      {loadingComments ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin tip="Đang tải bình luận..." size="large" />
        </div>
      ) : allComments.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
          Chưa có bình luận nào
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={allComments}
          renderItem={(comment) => (
            <List.Item
              key={comment._id}
              style={{
                borderBottom: "1px solid #e8e8e8",
                padding: "16px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <List.Item.Meta
                  title={
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        {comment.userId?.fullName || "Người dùng ẩn danh"}
                      </span>
                      <Rate
                        disabled
                        value={comment.rating}
                        style={{ marginLeft: "8px", fontSize: "14px" }}
                      />
                    </div>
                  }
                  description={
                    <div>
                      <p style={{ margin: "8px 0", color: "#595959" }}>
                        {comment.content}
                      </p>
                      <p style={{ color: "#888", fontSize: "12px" }}>
                        {new Date(comment.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  }
                />
              </div>

              <Popconfirm
                title="Xác nhận xóa"
                description="Chắc chắn xóa?"
                onConfirm={() => handleDeleteComment(comment._id)}
                okText="Xác nhận"
                cancelText="Hủy"
                placement="left"
              >
                <DeleteOutlined
                  className="text-lg"
                  style={{ cursor: "pointer", color: "red" }}
                />
              </Popconfirm>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default CommentDetailComponent;
