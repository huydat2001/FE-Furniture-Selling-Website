import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import { Button, Layout, theme } from "antd";
import FooterLayout from "./components/layout/footer";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import HeaderLayout from "./components/layout/header";
import { useEffect, useState } from "react";
import { useRef } from "react";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSiderVisible, setIsSiderVisible] = useState(false);
  const [userToggled, setUserToggled] = useState(false);
  const siderRef = useRef(null);

  useEffect(() => {
    // Media query cho md (≥768px)
    const mobileQuery = window.matchMedia("(min-width: 768px)");
    const handleMobileQueryChange = (e) => {
      setIsMobile(!e.matches); // true nếu < 768px, false nếu ≥ 768px
      if (!e.matches) {
        // Trên mobile, mặc định ẩn Sider
        setIsSiderVisible(false);
      } else {
        // Trên md trở lên, luôn hiển thị Sider
        setIsSiderVisible(true);
      }
    };

    // Media query cho lg (≥1024px)
    const lgQuery = window.matchMedia("(min-width: 1024px)");
    const handleLgQueryChange = (e) => {
      if (!userToggled) {
        setCollapsed(!e.matches); // Thu gọn nếu < 1024px, mở rộng nếu ≥ 1024px
      }
    };

    // Kiểm tra trạng thái ban đầu
    handleMobileQueryChange(mobileQuery);
    handleLgQueryChange(lgQuery);

    // Lắng nghe sự thay đổi
    mobileQuery.addEventListener("change", handleMobileQueryChange);
    lgQuery.addEventListener("change", handleLgQueryChange);

    // Cleanup
    return () => {
      mobileQuery.removeEventListener("change", handleMobileQueryChange);
      lgQuery.removeEventListener("change", handleLgQueryChange);
    };
  }, [userToggled]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isSiderVisible &&
        siderRef.current &&
        !siderRef.current.contains(event.target)
      ) {
        setIsSiderVisible(false); // Đóng Sider nếu click bên ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSiderVisible]);
  return (
    <>
      <Layout className="min-h-screen">
        <Sider
          theme="dark"
          ref={siderRef}
          width={250}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className={`${isSiderVisible ? "block" : "hidden"} md:block ${
            collapsed ? "w-20" : "w-64"
          } transition-all duration-300 fixed md:static top-0 left-0 h-full z-50`} // Fixed trên mobile, static trên md
        >
          <Navbar setCollapsed={setCollapsed} collapsed={collapsed} />
        </Sider>
        <Layout
          className={`transition-all duration-300 ${
            isSiderVisible && isMobile ? "opacity-50" : "opacity-100"
          }`}
        >
          <Header
            className={`bg-slate-50 p-0 flex items-center justify-between transition-all duration-300`}
          >
            <HeaderLayout
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              isMobile={isMobile}
              setUserToggled={setUserToggled}
              isSiderVisible={isSiderVisible}
              setIsSiderVisible={setIsSiderVisible}
            />
          </Header>
          <Content className="m-4 md:m-6">
            <Outlet />
          </Content>
          <Footer className="text-center p-4">
            <FooterLayout />
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
