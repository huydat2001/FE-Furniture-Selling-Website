import { React, useEffect, useState } from "react";
import { Button, Menu } from "antd";
import {
  ControlOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { BsFillMenuAppFill } from "react-icons/bs";
import { IoAnalytics } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
const Header = () => {
  const [current, setCurrent] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (location && location.pathname) {
      const allRoutes = ["users", "apps"];
      const currentRoute = allRoutes.find(
        (item) => `/${item}` === location.pathname
      );
      console.log("currentRoute :>> ", currentRoute);
      if (currentRoute) {
        setCurrent(currentRoute);
        if (currentRoute === "users") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "apps") {
          setOpenKeys(["overview"]);
        }
      } else {
        setCurrent("analytics");
        setOpenKeys(["overview"]);
      }
    }
  }, [location]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };
  console.log("current :>> ", current);
  console.log("open :>> ", openKeys);
  const items = [
    {
      icon: <HomeOutlined />,
      label: "OVERVIEW",
      key: "overview",
      children: [
        {
          label: <Link to="/">Analytics</Link>,
          key: "analytics",
          icon: <IoAnalytics />,
        },
        {
          label: <Link to="/apps">App</Link>,
          key: "apps",
          icon: <BsFillMenuAppFill />,
        },
      ],
    },
    {
      icon: <ControlOutlined />,
      label: "MANAGEMENT",
      key: "management",
      children: [
        {
          label: <Link to="/users">User</Link>,
          key: "users",
          icon: <FaUser />,
        },
      ],
    },
  ];

  return (
    <>
      <div style={{ width: 256 }}>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginBottom: 16 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          selectedKeys={[current]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>
    </>
  );
};
export default Header;
