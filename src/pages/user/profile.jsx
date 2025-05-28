import { Button, Form, Input, notification, Typography, Cascader } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getAccountAPI } from "../../services/login";
import { updateUserAPI } from "../../services/api.service.user";
import {
  getDistrictAPI,
  getProvinceAPI,
  getWardAPI,
} from "../../services/address/api.address";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    fullName: "",
    address: { street: "", city: "", state: "", country: "" },
    phone: "",
    role: "",
    isVerified: false,
    status: "",
    statusE: "",
    lastLogin: null,
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
            role: data.role || "customer",
            isVerified: data.isVerified || false,
            status: data.status || "active",
            statusE: data.statusE || "offline",
            lastLogin: data.lastLogin || null,
          };
          setUserData(formattedData);

          // Cập nhật giá trị form với dữ liệu từ API
          form.setFieldsValue({
            username: formattedData.username,
            email: formattedData.email,
            fullName: formattedData.fullName,
            address: formattedData.address,
            phone: formattedData.phone,
            role: formattedData.role,
            isVerified: formattedData.isVerified
              ? "Đã xác minh"
              : "Chưa xác minh",
            status: formattedData.status,
            statusE: formattedData.statusE,
            lastLogin: formattedData.lastLogin
              ? moment(formattedData.lastLogin).format("DD/MM/YYYY HH:mm")
              : "Chưa có",
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
        // Tải danh sách huyện khi chọn tỉnh
        const provinceId = targetOption.value;
        const response = await getDistrictAPI(provinceId);
        const districts = transformDistricts(response.data);
        targetOption.loading = false;
        targetOption.children = districts;
      } else if (selectedOptions.length === 2) {
        // Tải danh sách xã khi chọn huyện
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

  // Xử lý khi người dùng chọn tỉnh, huyện, xã
  const onAddressChange = (value, selectedOptions) => {
    if (value && selectedOptions) {
      const [province, district, ward] = selectedOptions;
      form.setFieldsValue({
        address: {
          state: province ? province.label : "", // Tỉnh
          city: district ? district.label : "", // Huyện
          street: ward ? ward.label : "", // Xã
          country: "Vietnam", // Quốc gia mặc định
        },
      });
    }
  };

  // Xử lý cập nhật thông tin
  const onFinish = async (values) => {
    setLoading(true);
    console.log("values :>> ", values);
    try {
      const updatedData = {
        id: userData.id,
        fullName: values.fullName,

        city: values.address.city, // Gửi city ở cấp root
        state: values.address.state, // Gửi state ở cấp root
        street: values.address.street, // Gửi street ở cấp root
        country: values.address.country, // Gửi country ở cấp root
        phone: values.phone,
      };
      console.log("updatedData :>> ", updatedData);
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
        });
        setEditing(false);
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
        padding: "20px",
        backgroundColor: "#f0f2f5",
      }}
    >
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
          Trang Cá Nhân
        </Title>
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => (editing ? setEditing(false) : setEditing(true))}
            disabled={loading}
          >
            {editing ? "Hủy" : "Chỉnh sửa"}
          </Button>
        </div>

        <Form
          form={form}
          name="profile"
          layout="vertical"
          onFinish={onFinish}
          disabled={!editing}
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

          <Form.Item label="Địa chỉ" required>
            {/* Dropdown chọn tỉnh, huyện, xã */}
            <Cascader
              options={options}
              loadData={loadData}
              onChange={onAddressChange}
              placeholder="Chọn tỉnh, huyện, xã"
              style={{ width: "100%", marginBottom: "10px" }}
              disabled={!editing}
            />
            <Input.Group compact>
              <Form.Item
                name={["address", "state"]}
                noStyle
                rules={[{ required: true, message: "Vui lòng chọn tỉnh!" }]}
              >
                <Input style={{ width: "33%" }} placeholder="Tỉnh" disabled />
              </Form.Item>
              <Form.Item
                name={["address", "city"]}
                noStyle
                rules={[{ required: true, message: "Vui lòng chọn huyện!" }]}
              >
                <Input style={{ width: "33%" }} placeholder="Huyện" disabled />
              </Form.Item>
              <Form.Item
                name={["address", "street"]}
                noStyle
                rules={[{ required: true, message: "Vui lòng chọn xã!" }]}
              >
                <Input style={{ width: "34%" }} placeholder="Xã" disabled />
              </Form.Item>
            </Input.Group>
            <Form.Item
              name={["address", "country"]}
              noStyle
              rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
            >
              <Input
                style={{ width: "100%", marginTop: "10px" }}
                placeholder="Quốc gia"
              />
            </Form.Item>
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Lần đăng nhập gần nhất" name="lastLogin">
            <Input disabled />
          </Form.Item>

          {editing && (
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
