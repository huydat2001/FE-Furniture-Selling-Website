import { Breadcrumb, Card, Col, Row } from "antd";
import Title from "antd/es/skeleton/Title";
import { Link } from "react-router-dom";
import OrderTableComponent from "../../components/order/order.table";
import { getAllOrderAPI } from "../../services/api.service.order";
import { useEffect, useState } from "react";

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchOrder();
  }, [current, pageSize]);
  const fetchOrder = async () => {
    const res = await getAllOrderAPI(current, pageSize);
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
              title: "Order",
            },
          ]}
        />

        {/* Page Header */}
        <Card className="mb-6" style={{ borderRadius: "8px" }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} lg={12}>
              <Title level={3} className="mb-0">
                Quản lý đơn hàng
              </Title>
              <p className="text-gray-500">
                Thêm, chỉnh sửa và quản lý danh sách đơn hàng.
              </p>
            </Col>
            <Col xs={24} lg={6}>
              {/* <Card
                title="Thêm người dùng"
                style={{ borderRadius: "8px" }}
                styles={{ body: { padding: "16px" } }}
                className="text-center"
              ></Card> */}
            </Col>
          </Row>
        </Card>

        {/* User Form and Table */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <Card
              title="Danh sách đơn hàng"
              style={{ borderRadius: "8px" }}
              styles={{ body: { padding: "16px" } }}
            >
              <OrderTableComponent
                data={data}
                current={current}
                setCurrent={setCurrent}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                loading={loading}
                fetchOrder={fetchOrder}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default OrderPage;
