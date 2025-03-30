import { Breadcrumb, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import UserTableComponent from "../../components/user/user.table";
import UserFormComponent from "../../components/user/user.form";
import { useEffect, useState } from "react";
import { getAllUserAPI } from "../../services/api.service.user";

const { Title } = Typography;

const UserPage = () => {
  const [dataUser, setDataUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

  const fetchUser = async () => {
    const res = await getAllUserAPI(current, pageSize);
    if (res.data) {
      setDataUser(res.data.result);
      setTotal(res.data.pagination.total_users);
      setLoading(false);
    }
  };

  return (
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
            title: "Users",
          },
        ]}
      />

      {/* Page Header */}
      <Card className="mb-6" style={{ borderRadius: "8px" }}>
        <Row align="middle" justify="space-between">
          <Col xs={24} lg={12}>
            <Title level={3} className="mb-0">
              Quản lý người dùng
            </Title>
            <p className="text-gray-500">
              Thêm, chỉnh sửa và quản lý danh sách người dùng.
            </p>
          </Col>
          <Col xs={24} lg={6}>
            <Card
              title="Thêm người dùng"
              style={{ borderRadius: "8px" }}
              styles={{ body: { padding: "16px" } }}
              className="text-center"
            >
              <UserFormComponent fetchUser={fetchUser} />
            </Card>
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
            <UserTableComponent
              dataUser={dataUser}
              current={current}
              setCurrent={setCurrent}
              pageSize={pageSize}
              setPageSize={setPageSize}
              total={total}
              loading={loading}
              fetchUser={fetchUser}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserPage;
