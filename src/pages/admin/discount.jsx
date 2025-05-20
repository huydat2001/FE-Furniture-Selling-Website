import { Breadcrumb, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import DiscountTableComponent from "../../components/discount/discount.table";
import { useEffect, useState } from "react";
import { getAllDiscountAPI } from "../../services/api.serivice.discount";
import DiscountFormComponent from "../../components/discount/discount.form";
import { getAllProductAPI } from "../../services/api.service.product";
const { Title } = Typography;

const DiscountPage = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(false);
  const [checkType, setCheckType] = useState(true);
  const [optionProduct, setOptionProduct] = useState([]);
  useEffect(() => {
    fetchDiscount();
  }, [current, pageSize]);
  const filter = { status: "active" };

  const fetchDiscount = async () => {
    const res = await getAllDiscountAPI(current, pageSize);
    if (res.data) {
      setData(res.data.result);
      setTotal(res.data.pagination.total);
      setLoading(false);
    }
  };
  const getProduct = async () => {
    const res = await getAllProductAPI(null, null, filter);
    const options = res.data.result
      .map((dis) => ({
        value: dis._id,
        label: dis.name,
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, "vi", { sensitivity: "base" })
      );
    setOptionProduct(options);
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
              title: "Discount",
            },
          ]}
        />

        {/* Page Header */}
        <Card className="mb-6" style={{ borderRadius: "8px" }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} lg={12}>
              <Title level={3} className="mb-0">
                Quản lý mã giảm giá
              </Title>
              <p className="text-gray-500">
                Thêm, chỉnh sửa và quản lý danh sách mã giảm giá.
              </p>
            </Col>
            <Col xs={24} lg={6}>
              <Card
                title="Thêm mã giảm giá"
                style={{ borderRadius: "8px" }}
                styles={{ body: { padding: "16px" } }}
                className="text-center"
              >
                <DiscountFormComponent
                  fetchDiscount={fetchDiscount}
                  check={check}
                  setCheck={setCheck}
                  checkType={checkType}
                  setCheckType={setCheckType}
                  getProduct={getProduct}
                  optionProduct={optionProduct}
                  setOptionProduct={setOptionProduct}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* User Form and Table */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <Card
              title="Danh sách mã giảm giá"
              style={{ borderRadius: "8px" }}
              styles={{ body: { padding: "16px" } }}
            >
              <DiscountTableComponent
                data={data}
                current={current}
                setCurrent={setCurrent}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                loading={loading}
                fetchDiscount={fetchDiscount}
                setCheck={setCheck}
                check={check}
                checkType={checkType}
                setCheckType={setCheckType}
                getProduct={getProduct}
                optionProduct={optionProduct}
                setOptionProduct={setOptionProduct}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default DiscountPage;
