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
import { nav } from "motion/react-client";
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
                onClose={() => setOpenProfile(false)}
                open={openProfile}
                styles={{
                  body: {
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
                footer={
                  <Button
                    danger
                    type="primary"
                    className="min-w-full"
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                    onClick={() => logout()}
                  >
                    Đăng xuất
                  </Button>
                }
              >
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#87d068",
                    marginBottom: "16px",
                  }}
                />
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {user.fullName}
                </h1>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#888",
                    marginBottom: "24px",
                  }}
                >
                  {user.email}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "100%",
                  }}
                >
                  <Button
                    type="default"
                    className="min-w-full"
                    style={{
                      height: "40px",
                      fontSize: "14px",
                    }}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Giao diện người dùng
                  </Button>
                </div>
              </Drawer>
            ) : (
              <Drawer
                className="text-center"
                onClose={() => setOpenProfile(false)}
                open={openProfile}
                styles={{
                  body: {
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
                footer={
                  <Button
                    type="primary"
                    className="min-w-full"
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </Button>
                }
              >
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#f56a00",
                    marginBottom: "16px",
                  }}
                />
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Chào mừng!
                </h1>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#888",
                    marginBottom: "24px",
                  }}
                >
                  Vui lòng đăng nhập để tiếp tục.
                </p>
              </Drawer>
            )}
          </Tooltip>
        </div>
      </div>
    </>
  );
};
export default HeaderLayout;
