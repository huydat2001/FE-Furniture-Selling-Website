import {
  AntDesignOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Tooltip } from "antd";

import { useState } from "react";
const HeaderLayout = (props) => {
  const {
    collapsed,
    setCollapsed,
    isMobile,
    setUserToggled,
    isSiderVisible,
    setIsSiderVisible,
  } = props;
  const getPageInfo = () => {
    switch (location.pathname) {
      case "/users":
        return { title: "Users", breadcrumb: "Management / User" };
      case "/apps":
        return { title: "Apps", breadcrumb: "Overview / App" };
      default:
        return { title: "Analytics", breadcrumb: "Overview / Analytics" };
    }
  };
  const { title, breadcrumb } = getPageInfo();
  const handleToggle = () => {
    if (isMobile) {
      // Trên mobile: Toggle hiển thị/ẩn Sider
      setIsSiderVisible(!isSiderVisible);
      // Nếu Sider đang ẩn, mở rộng nó khi hiển thị
      if (!isSiderVisible) {
        setCollapsed(false);
      }
    } else {
      // Trên md trở lên: Toggle thu gọn/mở rộng Sider
      setCollapsed(!collapsed);
    }
    setUserToggled(true); // Đánh dấu người dùng đã toggle thủ công
  };
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Button
          type="text"
          icon={
            isMobile ? (
              isSiderVisible ? (
                <MenuFoldOutlined />
              ) : (
                <MenuUnfoldOutlined />
              )
            ) : collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )
          }
          onClick={handleToggle}
          className="text-xl md:text-2xl"
        />
        {/* <div className="flex-1 px-4">
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">{breadcrumb}</p>
        </div> */}
        <div className="flex items-center gap-2 md:gap-4 pr-4">
          <Tooltip title="search">
            <Button
              className="text-sm md:text-base"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Tooltip>
          <Tooltip title="search">
            <Button
              className="text-sm md:text-base"
              shape="circle"
              icon={<BellOutlined />}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
};
export default HeaderLayout;
