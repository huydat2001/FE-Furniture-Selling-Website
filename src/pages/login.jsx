import { Button, Checkbox, Form, Input, Typography } from "antd";

const { Title, Text } = Typography;

const LoginPage = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
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
