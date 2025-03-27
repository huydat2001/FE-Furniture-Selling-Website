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
  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  const { collapsed, setCollapsed } = props;

  return (
    <>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="text-2xl"
      />
      <div className="content-end">
        <Tooltip title="search">
          <Button
            className="content-end"
            shape="circle"
            icon={<SearchOutlined />}
          />
        </Tooltip>
        <Tooltip title="search">
          <Button
            className="content-end"
            shape="circle"
            icon={<BellOutlined />}
          />
        </Tooltip>
      </div>
    </>
  );
};
export default HeaderLayout;
