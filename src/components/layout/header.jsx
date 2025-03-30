import {
  AntDesignOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, message, Tooltip } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth.context";
import { useNavigate } from "react-router-dom";
const HeaderLayout = (props) => {
  const [openProfile, setOpenProfile] = useState(false);
  const {
    collapsed,
    setCollapsed,
    isMobile,
    setUserToggled,
    isSiderVisible,
    setIsSiderVisible,
  } = props;
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser({
      email: "",
      phone: "",
      fullName: "",
      role: "",
      avatar: "",
      id: "",
    });
    message.success("logout thành công");
    navigate("/login");
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

        <div className="flex items-center gap-2 md:gap-4 pr-4">
          <Tooltip title="search">
            <Button
              className="text-sm md:text-base"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Tooltip>
          <Tooltip title="Thông báo">
            <Button
              className="text-sm md:text-base"
              shape="circle"
              icon={<BellOutlined />}
            />
          </Tooltip>
          <Tooltip title="User">
            <Button
              className="text-sm md:text-base"
              shape="circle"
              icon={<UserOutlined />}
              onClick={() => setOpenProfile(true)}
            />
            {user._id ? (
              <Drawer
                className="text-center"
                onClose={() => {
                  setOpenProfile(false);
                }}
                open={openProfile}
                styles={{
                  header: { display: "none" },
                  footer: { height: "20vh", borderTop: "none" },
                }}
                footer={
                  <Button
                    danger
                    className="min-w-full min-h-12"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Đăng xuất
                  </Button>
                }
              >
                <Avatar size={90} icon={<UserOutlined />} />
                <h1 className="text-lg font-bold my-10">{user.fullName}</h1>
                <p className="text-sm text-neutral-500 font-semibold">
                  {user.email}
                </p>
              </Drawer>
            ) : (
              <Drawer
                className="text-center"
                onClose={() => {
                  setOpenProfile(false);
                }}
                open={openProfile}
                styles={{
                  header: { display: "none" },
                  footer: { height: "20vh", borderTop: "none" },
                }}
                footer={
                  <Button
                    danger
                    className="min-w-full min-h-12"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Đăng nhập
                  </Button>
                }
              ></Drawer>
            )}
          </Tooltip>
        </div>
      </div>
    </>
  );
};
export default HeaderLayout;
