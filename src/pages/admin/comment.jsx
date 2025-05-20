import { Breadcrumb, Card, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { Link } from "react-router-dom";
import CommentTableComponent from "../../components/comment/comment.table";
import { getAllProductAPI } from "../../services/api.service.product";
import { useEffect, useState } from "react";

const CommentPage = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [current, pageSize]);
  const fetchProduct = async () => {
    const res = await getAllProductAPI(current, pageSize);
    if (res.data) {
      setData(res.data.result);
      setTotal(res.data.pagination.total);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="p-3 bg-gray-100 min-h-screen">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6"
          items={[
            {
              title: <Link to="/">Tổng quan</Link>,
            },
            {
              title: "Quản lý",
            },
            {
              title: "Bình luận",
            },
          ]}
        />

        {/* Page Header */}
        <Card className="mb-6" style={{ borderRadius: "8px" }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} lg={12}>
              <Title level={3} className="mb-0">
                Quản lý bình luận
              </Title>
              <p className="text-gray-500">Quản lý danh sách bình luận.</p>
            </Col>
          </Row>
        </Card>

        {/* User Form and Table */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <Card
              title="Danh sách người dùng"
              style={{ borderRadius: "8px" }}
              styles={{ body: { padding: "16px" } }}
            >
              <CommentTableComponent
                data={data}
                current={current}
                setCurrent={setCurrent}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                loading={loading}
                fetchProduct={fetchProduct}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default CommentPage;
