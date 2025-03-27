import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import { Button, Layout, theme } from "antd";
import FooterLayout from "./components/layout/footer";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import HeaderLayout from "./components/layout/header";
import { useState } from "react";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout className="min-h-screen">
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className={`hidden md:block ${
            collapsed ? "w-20" : "w-64"
          } transition-all duration-300`}
        >
          <Navbar
            className={"pt-100"}
            setCollapsed={setCollapsed}
            collapsed={collapsed}
          />
        </Sider>
        <Layout>
          <Header
            className={`bg-slate-50 p-0 flex items-center justify-between transition-all duration-300`}
          >
            <HeaderLayout setCollapsed={setCollapsed} collapsed={collapsed} />
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
