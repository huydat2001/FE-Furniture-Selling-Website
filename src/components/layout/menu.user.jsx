import { Menu } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { IoNewspaperOutline } from "react-icons/io5";
import { TbScanPosition } from "react-icons/tb";
import { GiPositionMarker } from "react-icons/gi";
import {
  MdOutlinePermDeviceInformation,
  MdOutlineWhatshot,
} from "react-icons/md";
const fontstyle = {
  fontSize: "18px",
};
const MenuUserComponent = () => {
  const [current, setCurrent] = useState("home");

  const items = [
    {
      label: "Trang chủ",
      key: "home",
      icon: <HomeOutlined style={fontstyle} />,
    },
    {
      label: "Sản phẩm",
      key: "products",
      icon: <AppstoreOutlined style={fontstyle} />,
      children: [
        {
          label: "Phòng ngủ",
          key: "bedroom",
          children: [
            {
              label: "Giường",
              key: "bed",
            },
            {
              label: "Tủ quần áo",
              key: "wardrobe",
            },
          ],
        },
        {
          label: "Phòng khách",
          key: "livingroom",
        },
      ],
    },
    {
      label: "Sản phẩm nổi bật",
      key: "hot",
      icon: <MdOutlineWhatshot style={fontstyle} />,
    },
    {
      label: "Tin tức",
      key: "news",
      icon: <IoNewspaperOutline style={fontstyle} />,
    },
    {
      label: "Giới thiệu",
      key: "info",
      icon: <MdOutlinePermDeviceInformation style={fontstyle} />,
    },
    {
      label: "Showroom",
      key: "showroom",
      icon: <GiPositionMarker style={fontstyle} />,
    },
  ];

  const onClick = (e) => {
    console.log("Menu Clicked:", e.key);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      className="bg-white font-normal"
      style={{
        borderBottom: "none",
        maxWidth: "1400px",
        margin: "0 auto",
        justifyContent: "center",
        fontSize: "16px",
      }}
    />
  );
};

export default MenuUserComponent;
