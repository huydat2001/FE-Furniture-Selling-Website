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
import { FaProductHunt, FaUser } from "react-icons/fa";
import { BiSolidCategory, BiSolidDiscount } from "react-icons/bi";
import { CiDiscount1 } from "react-icons/ci";
import { TbBrandBebo } from "react-icons/tb";
const Navbar = (props) => {
  const [current, setCurrent] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, setCollapsed } = props;
  useEffect(() => {
    if (location && location.pathname) {
      const allRoutes = [
        "users",
        "apps",
        "categorys",
        "analytics",
        "discounts",
        "brands",
        "products",
      ];

      // Trích xuất phần cuối của pathname (sau "/admin/")
      const pathSegments = location.pathname.split("/").filter(Boolean); // Tách thành mảng và bỏ phần tử rỗng
      const lastSegment = pathSegments[pathSegments.length - 1]; // Lấy phần cuối (users, apps, v.v.)

      // Kiểm tra xem lastSegment có nằm trong allRoutes không
      const currentRoute = allRoutes.find((item) => item === lastSegment);

      if (currentRoute) {
        setCurrent(currentRoute);
        if (currentRoute === "users") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "categorys") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "discounts") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "brands") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "products") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "apps") {
          setOpenKeys(["overview"]);
        }
      } else {
        // Nếu không khớp với route nào (ví dụ: /admin hoặc /admin/), mặc định là analytics
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
          label: <Link to="/admin">Analytics</Link>,
          key: "analytics",
          icon: <IoAnalytics />,
        },
        {
          label: <Link to="/admin/apps">App</Link>,
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
          label: <Link to="/admin/users">Người dùng</Link>,
          key: "users",
          icon: <FaUser />,
        },
        {
          label: <Link to="/admin/categorys">Danh mục</Link>,
          key: "categorys",
          icon: <BiSolidCategory />,
        },
        {
          label: <Link to="/admin/discounts">Phiếu giảm giá</Link>,
          key: "discounts",
          icon: <BiSolidDiscount />,
        },
        {
          label: <Link to="/admin/brands">Nhãn hàng</Link>,
          key: "brands",
          icon: <TbBrandBebo />,
        },
        {
          label: <Link to="/admin/products">Sản phẩm</Link>,
          key: "products",
          icon: <FaProductHunt />,
        },
      ],
    },
  ];

  return (
    <>
      {/* <div className="h-20">hello</div> */}

      <div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          // inlineCollapsed={collapsed}
          items={items}
          className="min-h-screen text-sm md:text-base"
        />
      </div>
    </>
  );
};
export default Navbar;
