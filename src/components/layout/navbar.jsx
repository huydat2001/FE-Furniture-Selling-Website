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
const Navbar = (props) => {
  const [current, setCurrent] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, setCollapsed } = props;
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
  }, [location, collapsed]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

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
  const toggleCollapsed = () => {
    setCollapsed(!collapsed); // Chỉ thay đổi collapsed khi nhấp nút
  };
  return (
    <>
      <div style={{ width: "100%" }}>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginBottom: 16, width: "100%" }}
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
export default Navbar;
