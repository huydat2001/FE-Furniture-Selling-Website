import { Button, Form, Input, notification, Typography } from "antd";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { forgotPasswordAPI, resetPasswordAPI } from "../services/login";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập mã và mật khẩu mới
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const onRequestReset = async () => {
    setLoading(true);
    try {
      const res = await forgotPasswordAPI({ email });
      if (res && res.data) {
        notification.success({
          message: "Thành công",
          description: "Mã đặt lại mật khẩu đã được gửi đến email của bạn.",
        });
        setStep(2); // Chuyển sang bước nhập mã và mật khẩu mới
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

  const onResetPassword = async () => {
    setLoading(true);
    if (newPassword !== confirmPassword) {
      notification.error({ message: "Mật khẩu không khớp!" });
      setLoading(false);
      return;
    }

    try {
      const res = await resetPasswordAPI({ email, token, newPassword });
      if (res && res.data) {
        notification.success({
          message: "Thành công",
          description:
            "Đặt lại mật khẩu thành công! Chuyển hướng đến đăng nhập...",
        });
        navigate("/login");
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
          {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          {step === 1
            ? "Vui lòng nhập email để nhận mã đặt lại mật khẩu"
            : "Vui lòng nhập mã và mật khẩu mới"}
        </Text>
        <Form
          name="forgot-password"
          layout="vertical"
          onFinish={step === 1 ? onRequestReset : onResetPassword}
          onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
        >
          {step === 1 && (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Không được để trống email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
          )}
          {step === 2 && (
            <>
              <Form.Item
                label="Mã đặt lại"
                name="token"
                rules={[
                  { required: true, message: "Vui lòng nhập mã đặt lại!" },
                ]}
              >
                <Input
                  placeholder="Nhập mã từ email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ]}
              >
                <Input.Password
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              block
              style={{ height: 40, fontSize: 16 }}
            >
              {step === 1 ? "Gửi mã" : "Đặt lại mật khẩu"}
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: "block", textAlign: "center", marginTop: 16 }}>
          Quay lại <a href="/login">Đăng nhập</a>
        </Text>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
