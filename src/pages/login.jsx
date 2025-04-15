import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  notification,
  Typography,
} from "antd";
import { loginAPI } from "../services/login";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth.context";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  // Theo dõi user và chuyển hướng khi user thay đổi
  useEffect(() => {
    if (user && user._id) {
      // Đã đăng nhập thành công
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);
  console.log("user effect :>> ", user);
  const onFinish = async (values) => {
    setLoading(true);
    const res = await loginAPI(values);
    if (res && res.data) {
      notification.success({
        message: "Đăng nhập thành công",
        description: `Chào mừng ${res.data.fullName}`,
      });
      localStorage.setItem("access_token", res.accessToken);
      setUser(res.data);
    } else {
      notification.error({
        message: "Lỗi Đăng nhập",
        description: res.message,
      });
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/image/372496.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        zIndex: 0,
      }}
    >
      <div
        style={{
          width: 400,
          padding: 24,
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Chào mừng bạn trở lại!
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          Vui lòng đăng nhập để tiếp tục
        </Text>
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Tên tài khoản"
            name="username"
            rules={[
              { required: true, message: "Không được để trống tên tài khoản!" },
            ]}
          >
            <Input placeholder="Nhập tài khoản của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Không được để trống mật khẩu!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu của bạn" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              block
              style={{ height: 40, fontSize: 16 }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: "block", textAlign: "center", marginTop: 16 }}>
          Bạn chưa có tài khoản? <a href="/register">Đăng kí ngay</a>
        </Text>
      </div>
    </div>
  );
};

export default LoginPage;
