import { Menu } from "antd";
import { AppstoreOutlined, HomeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IoNewspaperOutline } from "react-icons/io5";
import { GiPositionMarker } from "react-icons/gi";
import {
  MdOutlinePermDeviceInformation,
  MdOutlineWhatshot,
} from "react-icons/md";
import { getAllCategoryAPI } from "../../services/api.service.category";
import { Link } from "react-router-dom";

const fontstyle = {
  fontSize: "18px",
};

const MenuUserComponent = () => {
  const [current, setCurrent] = useState("home");
  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    const filter = { status: "active" };
    const res = await getAllCategoryAPI(null, null, filter);
    const listCategory = res.data.result;

    // Hàm xây dựng danh sách danh mục theo cấu trúc phân cấp
    const buildCategoryItems = () => {
      // Lọc danh mục cha (parent: null)
      const parentCategories = listCategory.filter((cat) => !cat.parent);

      // Xây dựng items cho menu
      const formattedCategories = parentCategories.map((parent) => {
        // Tìm danh mục con có parent._id trùng với _id của danh mục cha
        const children = listCategory
          .filter((cat) => cat.parent && cat.parent._id === parent._id)
          .map((child) => ({
            label: child.name,
            key: child._id,
          }));

        return {
          label: parent.name,
          key: parent._id,
          children: children.length > 0 ? children : undefined, // Nếu không có con thì không thêm thuộc tính children
        };
      });

      return formattedCategories;
    };

    // Tạo danh sách items cho menu
    const dynamicItems = [
      {
        label: <Link to="/">Trang chủ</Link>,
        key: "home",
        icon: <HomeOutlined style={fontstyle} />,
      },
      {
        label: "Sản phẩm",
        key: "products",
        icon: <AppstoreOutlined style={fontstyle} />,
        children: buildCategoryItems(), // Gắn danh mục động vào đây
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

    setCategorys(dynamicItems);
  };

  const onClick = (e) => {
    console.log("Menu Clicked:", e.key);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={categorys} // Sử dụng danh sách items động
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
