import { Layout, Row, Col, Divider } from "antd";
import {
  ShoppingCartOutlined,
  SwapOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
const policyClass =
  "h-[200px] border border-gray-200 flex flex-col items-center justify-center transition-all duration-300 hover:bg-gray-100 hover:tracking-widest cursor-pointer";
const FooterUser = () => {
  return (
    <>
      {/* Phần trên: Các biểu tượng và thông tin ngắn */}
      <div className="max-w-[1400px] mx-auto py-10">
        <Row gutter={[16, 16]} className="text-center">
          <Col className={policyClass} xs={24} sm={12} md={6}>
            <ShoppingCartOutlined className="text-4xl text-gray-600 animate_animated animate_headShake, animate_infinite" />
            <p className="mt-2 font-semibold">GIAO HÀNG & LẮP ĐẶT</p>
            <p className="text-sm">Miễn Phí</p>
          </Col>
          <Col className={policyClass} xs={24} sm={12} md={6}>
            <SwapOutlined className="text-4xl text-gray-600" />
            <p className="mt-2 font-semibold">ĐỔI 1-1</p>
            <p className="text-sm">Miễn Phí</p>
          </Col>
          <Col className={policyClass} xs={24} sm={12} md={6}>
            <SafetyCertificateOutlined className="text-4xl text-gray-600" />
            <p className="mt-2 font-semibold">BẢO HÀNH 2 NĂM</p>
            <p className="text-sm">Miễn Phí</p>
          </Col>
          <Col className={policyClass} xs={24} sm={12} md={6}>
            <PhoneOutlined className="text-4xl text-gray-600" />
            <p className="mt-2 font-semibold">TƯ VẤN THIẾT KẾ</p>
            <p className="text-sm">Miễn Phí</p>
          </Col>
        </Row>
      </div>

      <Divider className="my-4" />

      {/* Phần giữa: 4 cột thông tin */}
      <div className="max-w-[1400px] mx-auto">
        <Row gutter={[16, 16]}>
          {/* Cột 1: NỘI THẤT MOHO */}
          <Col xs={24} sm={12} md={6}>
            <h4 className="font-bold text-lg mb-4">NỘI THẤT MUJI</h4>
            <p className="text-sm">
              NỘI THẤT MUJI là thương hiệu đến từ nhật bản với 45 năm kinh
              nghiệm trong việc sản xuất và xuất khẩu nội thất đạt chuẩn quốc
              tế.
            </p>
            <div className="mt-4">
              <a href="http://online.gov.vn/Home/WebDetails/123273">
                <img src="/logoSaleNoti.png" alt="DMCA" className="h-20" />
              </a>
              <img
                src="/MUJI_logo.svg.png"
                alt="Certified"
                className="h-10 mx-auto"
              />
            </div>
          </Col>

          {/* Cột 2: DỊCH VỤ */}
          <Col xs={24} sm={12} md={6}>
            <h4 className="font-bold text-lg mb-4">DỊCH VỤ</h4>
            <ul className="text-sm space-y-2">
              <li>Chính Sách Bảo Hành & Lắp Đặt</li>
              <li>Chính Sách Bảo Hành & Bảo Trì</li>
              <li>Chính Sách Đổi Trả</li>
              <li>Khách Hàng Thành Thiện - MUJI Rewards</li>
              <li>Chính Sách Bảo Mật Thông Tin</li>
            </ul>
          </Col>

          {/* Cột 3: THÔNG TIN LIÊN HỆ */}
          <Col xs={24} sm={12} md={6}>
            <h4 className="font-bold text-lg mb-4">THÔNG TIN LIÊN HỆ</h4>
            <ul className="text-sm space-y-2">
              <li>
                <span className="font-semibold">Khu Vực TP. Hồ Chí Minh</span>
              </li>
              <li>
                Tầng 1 & 2, 35Bis-45 Lê Thánh Tôn, P. Bến Nghé, Quận 1 công ty
              </li>
              <li>Hotline: 0938 854 475</li>
              <li className="mt-4">
                <span className="font-semibold">Khu vực TP. Hà Nội</span>
              </li>
              <li>
                Tầng 1 & 2, TTTM Vincom Center Metropolis, 29 Liễu Giai, P. Ngọc
                Khánh, Q. Ba Đình
              </li>
              <li>Hotline: 0963 266 617</li>
            </ul>
          </Col>

          {/* Cột 4: FANPAGE */}
          <Col xs={24} sm={12} md={6}>
            <h4 className="font-bold text-lg mb-4">FANPAGE</h4>
            <div>
              <FacebookOutlined className="text-2xl text-blue-600" />
              <p className="text-sm ">
                MUJI Vietnam <br /> 265K người theo dõi <br /> 243k người thích
              </p>
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="my-4" />

      {/* Phần dưới: Thông tin bản quyền */}
      <div className="text-center text-sm">
        <p>
          Design by Nguyễn Huy Đạt © {new Date().getFullYear()} MUJI Vietnam |
          Designed with ❤️ by Ant UED
        </p>
      </div>
    </>
  );
};

export default FooterUser;
