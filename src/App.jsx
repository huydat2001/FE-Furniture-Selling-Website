import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import { Button, Layout, theme } from "antd";
import FooterLayout from "./components/layout/footer";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import HeaderLayout from "./components/layout/header";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={250} collapsible collapsed={collapsed} trigger={null}>
          <Navbar setCollapsed={setCollapsed} collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <HeaderLayout setCollapsed={setCollapsed} collapsed={collapsed} />
          </Header>
          <Content style={{ margin: "16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <FooterLayout />
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
