import { Carousel, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Outlet, useLocation } from "react-router-dom";
import MenuUserComponent from "../../components/layout/menu.user";
import HeaderUser from "../../components/layout/header.user";
import FooterUser from "../../components/layout/footer.user";
import ScrollToTop from "../../components/until/scrolltotop";
import ChatWidget from "../../components/chatting/chat.widget";

const UserLayout = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        {/* Header không sticky */}
        <Header
          className="bg-white m-0 p-0 "
          style={{
            borderBottom: "1px solid #e8e8e8",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          <HeaderUser />
        </Header>

        {/* Header sticky chứa menu */}
        <Header
          className="bg-white m-0 p-0"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            width: "100%",
            borderBottom: "1px solid #e8e8e8",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          <MenuUserComponent />
        </Header>
        {/* Hiển thị Carousel chỉ trên HomePage */}
        {location.pathname === "/" && (
          <Carousel
            autoplay={{ dotDuration: true }}
            arrows
            infinite={true}
            speed={500}
            autoplaySpeed={2000}
            fade={true}
            arrowSize={300}
          >
            <div>
              <img src="/image/slideshow_1_master.webp" alt="slide1" />
            </div>
            <div>
              <img src="/image/slideshow_2.webp" alt="slide2" />
            </div>
            <div>
              <img src="/image/slideshow_5.webp" alt="slide3" />
            </div>
            <div>
              <img src="/image/slideshow_8.webp" alt="slide4" />
            </div>
          </Carousel>
        )}
        {/* Nội dung chính */}
        <Content
          className="min-h-screen w-[95vw] xl:w-[75vw] mx-auto"
          style={{
            padding: "16px 24px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Outlet />
        </Content>
        <ChatWidget />
        {/* Footer */}
        <Footer className="bg-white text-gray-700 text-center py-4 px-0 border-t border-gray-100 border-solid">
          <FooterUser />
        </Footer>
      </Layout>
    </>
  );
};

export default UserLayout;
