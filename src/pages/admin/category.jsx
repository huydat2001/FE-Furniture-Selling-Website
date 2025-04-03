import { Breadcrumb, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import CategoryFormComponent from "../../components/category/category.form";
import CategoryTableComponent from "../../components/category/category.table";
import { useEffect, useState } from "react";
import { getAllCategoryAPI } from "../../services/api.service.category";
const { Title } = Typography;

const CategoryPage = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCategory();
  }, [current, pageSize]);
  const fetchCategory = async () => {
    const res = await getAllCategoryAPI(current, pageSize);
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
              title: <Link to="/">Dashboard</Link>,
            },
            {
              title: "Management",
            },
            {
              title: "Category",
            },
          ]}
        />

        {/* Page Header */}
        <Card className="mb-6" style={{ borderRadius: "8px" }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} lg={12}>
              <Title level={3} className="mb-0">
                Quản lý danh mục
              </Title>
              <p className="text-gray-500">
                Thêm, chỉnh sửa và quản lý danh sách danh mục.
              </p>
            </Col>
            <Col xs={24} lg={6}>
              <Card
                title="Thêm danh mục"
                style={{ borderRadius: "8px" }}
                styles={{ body: { padding: "16px" } }}
                className="text-center"
              >
                <CategoryFormComponent fetchCategory={fetchCategory} />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* User Form and Table */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <Card
              title="Danh sách danh mục
              "
              style={{ borderRadius: "8px" }}
              styles={{ body: { padding: "16px" } }}
            >
              <CategoryTableComponent
                data={data}
                current={current}
                setCurrent={setCurrent}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                loading={loading}
                fetchCategory={fetchCategory}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default CategoryPage;
