import { React, useEffect, useState } from "react";
import { Button, Menu } from "antd";
import {
  CommentOutlined,
  ControlOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { BsFillMenuAppFill } from "react-icons/bs";
import { IoAnalytics, IoChatbubblesOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCommentDots,
  FaFileExport,
  FaProductHunt,
  FaUser,
} from "react-icons/fa";
import { BiSolidCategory, BiSolidDiscount } from "react-icons/bi";
import { TbBrandBebo } from "react-icons/tb";
import { MdPayments } from "react-icons/md";
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
        "orders",
        "comments",
        "chats",
        "export",
      ];

      const pathSegments = location.pathname.split("/").filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
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
        if (currentRoute === "orders") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "comments") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "chats") {
          setOpenKeys(["management"]);
        }
        if (currentRoute === "export") {
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
      label: "Tổng quan",
      key: "overview",
      children: [
        {
          label: <Link to="/admin">Phân tích</Link>,
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
      label: "Quản lý",
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
        {
          label: <Link to="/admin/orders">Giao dịch</Link>,
          key: "orders",
          icon: <MdPayments />,
        },
        {
          label: <Link to="/admin/comments">Bình luận</Link>,
          key: "comments",
          icon: <FaCommentDots />,
        },
        {
          label: <Link to="/admin/chats">Tin nhắn</Link>,
          key: "chats",
          icon: <IoChatbubblesOutline />,
        },
        {
          label: <Link to="/admin/export">Xuất báo cáo</Link>,
          key: "export",
          icon: <FaFileExport />,
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
