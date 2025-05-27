import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  notification,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import { registerAPI, verifyEmailAPI } from "../services/login";
// import { registerAPI, verifyEmailAPI } from "../services/authe.serviceapi";

const { Title, Text } = Typography;

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Đăng ký, 2: Xác nhận mã
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown countdown
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Đếm ngược cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Kiểm tra nếu quay lại trang, giữ email đã nhập
  useEffect(() => {
    const savedEmail = localStorage.getItem("signupEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    if (password !== passwordAgain) {
      notification.error({ message: "Mật khẩu không khớp!" });
      setLoading(false);
      return;
    }

    const data = { email, username, password };
    try {
      const res = await registerAPI(data);
      if (res && res.data) {
        notification.success({
          message: "Thành công",
          description: "Mã xác nhận đã được gửi đến email của bạn.",
        });
        setStep(2); // Chuyển sang bước xác nhận mã
        setResendCooldown(60); // Bắt đầu countdown 60 giây
        localStorage.setItem("signupEmail", email); // Lưu email để dùng lại
      } else {
        notification.error({
          message: "Lỗi",
          description: res.message || "Đã có lỗi xảy ra",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Đã có lỗi xảy ra",
      });
    }
    setLoading(false);
  };

  const onResendCode = async () => {
    setLoading(true);
    const data = { email, username, password };
    try {
      const res = await registerAPI(data);
      if (res && res.data) {
        notification.success({
          message: "Thành công",
          description: "Đã gửi lại mã xác nhận về email của bạn.",
        });
        setResendCooldown(60); // Reset countdown
        setCode(""); // Xóa mã cũ để người dùng nhập lại
      } else {
        notification.error({
          message: "Lỗi",
          description: res.message || "Đã có lỗi xảy ra",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Đã có lỗi xảy ra",
      });
    }
    setLoading(false);
  };

  const onVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyEmailAPI({ email, code });
      if (res && res.data) {
        notification.success({
          message: "Thành công",
          description: "Xác thực email thành công! Chuyển hướng...",
        });
        navigate("/login");
        localStorage.removeItem("signupEmail"); // Xóa email sau khi xác nhận
      } else {
        notification.error({
          message: "Lỗi",
          description: res.message || "Đã có lỗi xảy ra",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Đã có lỗi xảy ra",
      });
    }
    setLoading(false);
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
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          {step === 1 ? "Đăng ký tài khoản" : "Xác nhận mã"}
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          {step === 1
            ? "Vui lòng nhập thông tin đăng ký để tiếp tục"
            : "Vui lòng nhập mã xác nhận từ email"}
        </Text>
        <Form
          name="signup"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={step === 1 ? onFinish : onVerify}
          onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
        >
          {step === 1 && (
            <>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Không được để trống email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
                initialValue={email}
              >
                <Input
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // disabled={!!localStorage.getItem("signupEmail")}
                />
              </Form.Item>
              <Form.Item
                label="Tên tài khoản"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên tài khoản!",
                  },
                ]}
                initialValue={username}
              >
                <Input
                  placeholder="Nhập tài khoản của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // disabled={!!localStorage.getItem("signupEmail")}
                />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Không được để trống mật khẩu!" },
                  {
                    min: 6,
                    message: "Mật khẩu phải có ít nhất 6 kí tự",
                  },
                ]}
                initialValue={password}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // disabled={!!localStorage.getItem("signupEmail")}
                />
              </Form.Item>
              <Form.Item
                label="Nhập lại mật khẩu"
                name="passwordAgain"
                rules={[
                  { required: true, message: "Không được để trống mật khẩu!" },
                  {
                    min: 6,
                    message: "Mật khẩu phải có ít nhất 6 kí tự",
                  },
                ]}
                initialValue={passwordAgain}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu của bạn"
                  value={passwordAgain}
                  onChange={(e) => setPasswordAgain(e.target.value)}
                  // disabled={!!localStorage.getItem("signupEmail")}
                />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </>
          )}
          {step === 2 && (
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác nhận!" },
              ]}
            >
              <Input
                placeholder="Nhập mã xác nhận"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              block
              style={{ height: 40, fontSize: 16 }}
            >
              {step === 1 ? "Đăng ký" : "Xác nhận"}
            </Button>
          </Form.Item>
        </Form>
        {step === 2 && (
          <Text
            style={{ display: "block", textAlign: "center", marginTop: 16 }}
          >
            Không nhận được mã?{" "}
            <a
              onClick={resendCooldown === 0 ? onResendCode : undefined}
              style={{
                color: resendCooldown === 0 ? "#1890ff" : "#d9d9d9",
                cursor: resendCooldown === 0 ? "pointer" : "not-allowed",
              }}
            >
              Gửi lại mã {resendCooldown > 0 && `(${resendCooldown}s)`}
            </a>
          </Text>
        )}
        <Text style={{ display: "block", textAlign: "center", marginTop: 16 }}>
          Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </Text>
      </div>
    </div>
  );
};

export default SignUpPage;
