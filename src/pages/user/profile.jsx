import { Button, Form, Input, notification, Typography, Cascader } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getAccountAPI } from "../../services/login";
import {
  updateUserAPI,
  changePasswordAPI,
} from "../../services/api.service.user";
import {
  getDistrictAPI,
  getProvinceAPI,
  getWardAPI,
} from "../../services/address/api.address";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false); // State cho form thông tin
  const [editingPassword, setEditingPassword] = useState(false); // State cho form đổi mật khẩu
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    fullName: "",
    address: { street: "", city: "", state: "", country: "" },
    phone: "",
    id: "",
    role: "",
  });
  const [options, setOptions] = useState([]); // Danh sách tỉnh, huyện, xã
  const navigate = useNavigate();

  // Lấy danh sách tỉnh khi trang được tải
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvinceAPI(); // Gọi API lấy danh sách tỉnh
        const provinces = transformProvinces(response.data);
        setOptions(provinces);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách tỉnh.",
        });
      }
    };
    fetchProvinces();
  }, []);

  // Lấy thông tin người dùng khi tải trang
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await getAccountAPI();
        if (res && res.data) {
          const data = res.data;
          console.log("data :>> ", data);
          const formattedData = {
            id: data._id,
            username: data.username || "",
            email: data.email || "",
            fullName: data.fullName || "",
            address: data.address || {
              street: "",
              city: "",
              state: "",
              country: "",
            },
            phone: data.phone || "",
            role: data.role,
          };
          setUserData(formattedData);

          // Cập nhật giá trị form với dữ liệu từ API
          form.setFieldsValue({
            username: formattedData.username,
            email: formattedData.email,
            fullName: formattedData.fullName,
            address: formattedData.address
              ? [
                  formattedData.address.state,
                  formattedData.address.city,
                  formattedData.address.street,
                ]
              : [],
            phone: formattedData.phone,
            id: formattedData.id,
            role: formattedData.role,
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: "Không thể tải thông tin người dùng",
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
    fetchUserData();
  }, [form]);

  // Hàm tải dữ liệu huyện và xã động
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      if (selectedOptions.length === 1) {
        const provinceId = targetOption.value;
        const response = await getDistrictAPI(provinceId);
        const districts = transformDistricts(response.data);
        targetOption.loading = false;
        targetOption.children = districts;
      } else if (selectedOptions.length === 2) {
        const districtId = targetOption.value;
        const response = await getWardAPI(districtId);
        const wards = transformWard(response.data);
        targetOption.loading = false;
        targetOption.children = wards;
      }
      setOptions([...options]);
    } catch (error) {
      targetOption.loading = false;
      console.error("Lỗi khi tải dữ liệu:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu địa chỉ.",
      });
    }
  };

  // Hàm chuyển đổi dữ liệu API
  const transformProvinces = (provinces) => {
    return provinces.map((province) => ({
      value: province.ProvinceID,
      label: province.ProvinceName,
      isLeaf: false,
    }));
  };

  const transformDistricts = (districts) => {
    return districts.map((district) => ({
      value: district.DistrictID,
      label: district.DistrictName,
      isLeaf: false,
    }));
  };

  const transformWard = (wards) => {
    return wards.map((ward) => ({
      value: ward.WardCode,
      label: ward.WardName,
      isLeaf: true,
    }));
  };

  // Xử lý cập nhật thông tin
  const onFinishProfile = async (values) => {
    setLoading(true);
    console.log("values :>> ", values);
    try {
      const updatedData = {
        id: values.id,
        fullName: values.fullName,
        city: values.address && values.address[1] ? values.address[1] : "",
        state: values.address && values.address[0] ? values.address[0] : "",
        street: values.address && values.address[2] ? values.address[2] : "",
        country: "Vietnam",
        phone: values.phone,
        role: values.role,
      };
      const res = await updateUserAPI(updatedData);
      if (res && res.data) {
        notification.success({
          message: "Thành công",
          description: "Cập nhật thông tin thành công!",
        });
        setUserData({
          ...userData,
          fullName: updatedData.fullName,
          address: {
            street: updatedData.street,
            city: updatedData.city,
            state: updatedData.state,
            country: updatedData.country,
          },
          phone: updatedData.phone,
          role: updatedData.role,
        });
        setEditingProfile(false);
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

  // Xử lý đổi mật khẩu
  const onFinishPassword = async (values) => {
    setLoading(true);
    console.log("password values :>> ", values);
    try {
      const passwordData = {
        id: userData.id,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      const res = await changePasswordAPI(passwordData);
      console.log("res :>> ", res);
      if (res && res.data) {
        notification.success({
          message: "Thành công",
          description: "Đổi mật khẩu thành công!",
        });
        setEditingPassword(false);
        form.resetFields(["currentPassword", "newPassword"]);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.error.message || "Đã có lỗi xảy ra",
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
        padding: "20px",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* Form cập nhật thông tin */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "24px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
          Trang Cá Nhân
        </Title>
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => setEditingProfile(!editingProfile)}
            disabled={loading}
          >
            {editingProfile ? "Hủy" : "Chỉnh sửa"}
          </Button>
        </div>

        <Form
          form={form}
          name="profile"
          layout="vertical"
          onFinish={onFinishProfile}
          disabled={!editingProfile}
        >
          <Form.Item label="Tên đăng nhập" name="username">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Họ và tên" name="fullName">
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              {
                type: "array",
                required: true,
                message: "Vui lòng chọn tỉnh, huyện, xã!",
              },
            ]}
            getValueFromEvent={(value, selectedOptions) => {
              return selectedOptions.map((option) => option.label);
            }}
          >
            <Cascader
              options={options}
              loadData={loadData}
              placeholder="Chọn tỉnh, huyện, xã"
              style={{ width: "100%", marginBottom: "10px" }}
              disabled={!editingProfile}
              changeOnSelect
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item name="role" className="hidden">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="id" className="hidden">
            <Input disabled={true} />
          </Form.Item>

          {editingProfile && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ marginTop: "20px" }}
              >
                Lưu thay đổi
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>

      {/* Form đổi mật khẩu */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "24px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
          Đổi mật khẩu
        </Title>
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => setEditingPassword(!editingPassword)}
            disabled={loading}
          >
            {editingPassword ? "Hủy" : "Đổi mật khẩu"}
          </Button>
        </div>

        <Form
          form={form}
          name="changePassword"
          layout="vertical"
          onFinish={onFinishPassword}
          disabled={!editingPassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu hiện tại!",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
              {
                min: 6,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự!",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          {editingPassword && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ marginTop: "20px" }}
              >
                Lưu thay đổi
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
