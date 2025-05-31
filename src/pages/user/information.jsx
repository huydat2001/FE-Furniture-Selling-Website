import React from "react";
import { Link } from "react-router-dom";

const InformationPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            Câu Chuyện Thương Hiệu MOHO
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mỗi chi tiết, mỗi sản phẩm và hình ảnh đều là những dấu ấn, là câu
            chuyện mà MOHO muốn gửi gắm đến mỗi khách hàng. MOHO hi vọng sẽ trở
            thành một phần trong tổ ấm của mỗi gia đình Việt, mang yêu thương
            gửi trọn trong từng không gian sống.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Hành Trình Ra Đời
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <p className="text-gray-600 leading-relaxed">
                Chính những khát khao biến nhà thực sự là "tổ ấm", tháng
                03/2020, thương hiệu nội thất MOHO được định hình và ra đời. Là
                một phần của Savimex với gần 40 năm kinh nghiệm trong sản xuất
                và xuất khẩu nội thất sang các thị trường khó tính như Mỹ, Nhật,
                Hàn,... MOHO tiếp tục kế thừa và phát huy nhằm mang đến cho
                người Việt những joie phẩm nội thất 100% made in Vietnam theo
                tiêu chuẩn quốc tế, đảm bảo an toàn sức khỏe với chi phí hợp lý.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <img
                  src="../../../public/image/column01_03_2017aw.jpg"
                  alt="Nhà máy Savimex"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Hướng Đến Giá Trị Bền Vững
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Mang khái niệm “bền vững” vào trong sản phẩm - dịch vụ nội thất là
            bước đi tiên phong và đầy thách thức mà MOHO luôn không ngừng nỗ lực
            nhằm lan tỏa, truyền cảm hứng về một lối sống tích cực, tiêu dùng
            bền vững hơn vì một tương lai của hành tinh xanh.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Truyền Cảm Hứng
              </h3>
              <p className="text-gray-600">
                Truyền cảm hứng về tiêu dùng bền vững đến mọi người tại Việt
                Nam.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Nguyên Liệu FSC
              </h3>
              <p className="text-gray-600">
                Sử dụng 100% nguồn nguyên liệu gỗ đạt chứng nhận FSC® - Forest
                Stewardship Council®.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Đọc thêm →
              </a>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Bảo Trì Trọn Đời
              </h3>
              <p className="text-gray-600">
                Bảo trì trọn đời sản phẩm nhằm kéo dài tuổi thọ và tính hữu
                dụng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmentally Friendly Section */}
      <section className="bg-gradient-to-r from-green-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Thân Thiện Môi Trường
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <img
                  src="../../../public/image/noi-that-moho-ben-vung-fsc_9f0b5_d1f6c79c916c41179ced29c23c4e70e6.jpg"
                  alt="Sản phẩm gỗ MOHO đạt chuẩn FSC"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <p className="text-gray-600 leading-relaxed">
                MOHO với xuất phát điểm muốn lan tỏa thông điệp "Sống xanh", mỗi
                sản phẩm nội thất đều bắt nguồn từ nguyên liệu gỗ đạt chuẩn FSC
                - khai thác từ nguồn rừng có trồng lại. Giá trị tốt đẹp này
                không chỉ riêng MOHO mà mỗi khách hàng sử dụng sản phẩm MOHO đều
                đóng góp và nhân rộng lên giá trị bền vững.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Safety Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            An Toàn Sức Khỏe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Chứng Nhận CARB P2
              </h3>
              <p className="text-gray-600">
                Đạt chứng nhận giảm phát thải Formaldehyde – CARB P2, đảm bảo gỗ
                không độc hại.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Đọc thêm →
              </a>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {" "}
                Sơn Gốc Nước
              </h3>
              <p className="text-gray-600">
                Ưu tiên sử dụng sơn gốc nước thay cho sơn gốc dầu, an toàn cho
                sức khỏe.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Đọc thêm →
              </a>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Anti Tip Kit
              </h3>
              <p className="text-gray-600">
                Trang bị bộ anti tip kit cho tủ, tránh tình trạng tủ bị lật, đặc
                biệt an toàn cho trẻ nhỏ.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Đọc thêm →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Chất Lượng Quốc Tế
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <p className="text-gray-600 leading-relaxed">
                Sản xuất trực tiếp tại nhà máy Savimex với công nghệ hiện đại
                cùng đội ngũ thợ tay nghề cao. Nhà máy chế biến gỗ đầu tiên tại
                Việt Nam đạt chứng nhận hệ thống quản lý môi trường đạt chuẩn
                quốc tế ISO 14001, rộng 10ha với hơn 1,500 công nhân viên giàu
                kinh nghiệm.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                Khám phá quy trình sản xuất chuẩn quốc tế →
              </a>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <img
                  src="../../../public/image/cac_chung_nhan_5dc19da866684a2ca7bd611c5cbad606_2048x2048.jpg"
                  alt="Quy trình sản xuất tại Savimex"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Quote Section */}
      <section className="bg-blue-50 py-16 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Tinh Tế Trong Từng Đường Nét
          </h2>
          <blockquote className="text-xl italic text-gray-600 max-w-3xl mx-auto">
            "Điều tôi muốn xây dựng ở đây là mang đến những thiết kế cao cấp
            dành riêng cho người Việt. Tôi muốn giúp khách hàng cá nhân hóa
            không gian sống thật sự phù hợp và lý tưởng. MOHO, chúng tôi làm tất
            cả vì khách hàng."
          </blockquote>
          <p className="mt-4 text-gray-800 font-semibold">
            Mr. Nicolai Lehn - Giám đốc thiết kế của MOHO
          </p>
        </div>
      </section>

      {/* Showroom Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Trải Nghiệm Tốt Nhất
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Tham quan và trải nghiệm cửa hàng nội thất của MOHO với lối kiến
            trúc không gian mở hiện đại, mang đến trải nghiệm mua sắm tuyệt vời
            cho khách hàng.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Showroom
              </h3>
              <p className="text-gray-600">
                162 HT17, P. Hiệp Thành, Q. 12, TP. HCM
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Experience Store 1
              </h3>
              <p className="text-gray-600">
                S05.03-S18, Phân khu The Rainbow, Vinhomes Grand Park, TP. Thủ
                Đức
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Experience Store 2
              </h3>
              <p className="text-gray-600">
                S3.03-Sh15, Phân khu Sapphire, Vinhomes Smart City, Hà Nội
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Các Chứng Nhận Của MOHO
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">Chứng nhận FSC®</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">Chứng nhận CARB P2</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">ISO 14001</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-blue-600 py-12 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Khám Phá Nội Thất MOHO Ngay Hôm Nay
        </h2>
        <Link
          to="/showroom"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
          Ghé Thăm Showroom
        </Link>
      </section>
    </div>
  );
};

export default InformationPage;
