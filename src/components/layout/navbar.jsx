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
import { BiSolidCategory } from "react-icons/bi";
const Navbar = (props) => {
  const [current, setCurrent] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, setCollapsed } = props;
  useEffect(() => {
    if (location && location.pathname) {
      const allRoutes = ["users", "apps", "categorys", "analytics"];
      const currentRoute = allRoutes.find(
        (item) => `/${item}` === location.pathname
      );
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
        {
          label: <Link to="/categorys">Category</Link>,
          key: "categorys",
          icon: <BiSolidCategory />,
        },
      ],
    },
  ];

  return (
    <>
      <div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          // openKeys={openKeys}
          // onOpenChange={onOpenChange}
          // inlineCollapsed={collapsed}
          items={items}
          className="min-h-screen text-sm md:text-base"
        />
      </div>
    </>
  );
};
export default Navbar;
