import {
  Button,
  Cascader,
  Form,
  Input,
  Modal,
  notification,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  getDistrictAPI,
  getProvinceAPI,
  getWardAPI,
} from "../../services/address/api.address";
import { createUserAPI } from "../../services/api.service.user";
import { PlusOutlined } from "@ant-design/icons";

const UserFormComponent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residenceLabels, setResidenceLabels] = useState([]);
  const [options, setOptions] = useState([]);
  const [userForm] = Form.useForm();
  const { fetchUser, dataUpdate, isModalUpdateOpen } = props;
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvinceAPI();
        const provinces = transformProvinces(response.data);
        setOptions(provinces);
      } catch (error) {
        console.error("Lỗi khi lấy tỉnh/thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  const { Option } = Select;
  // Tải quận/huyện khi người dùng chọn tỉnh/thành
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      // Kiểm tra cấp hiện tại (Tỉnh/Thành hay Quận/Huyện)
      if (selectedOptions.length === 1) {
        // Cấp 1: Tỉnh/Thành -> Tải Quận/Huyện
        const provinceId = targetOption.value;
        const response = await getDistrictAPI(provinceId);
        const districts = transformDistricts(response.data);
        targetOption.loading = false;
        targetOption.children = districts;
      } else if (selectedOptions.length === 2) {
        // Cấp 2: Quận/Huyện -> Tải Phường/Xã
        const districtId = targetOption.value;
        const response = await getWardAPI(districtId);
        const wards = transformWard(response.data);
        targetOption.loading = false;
        targetOption.children = wards;
      }
      setOptions([...options]); // Cập nhật lại options
    } catch (error) {
      targetOption.loading = false;
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  const transformProvinces = (provinces) => {
    return provinces.map((province) => ({
      value: province.ProvinceID,
      label: province.ProvinceName,
      isLeaf: false, // Cho phép tải dữ liệu con (huyện)
    }));
  };
  // Chuyển dữ liệu quận/huyện
  const transformDistricts = (districts) => {
    return districts.map((district) => ({
      value: district.DistrictID,
      label: district.DistrictName,
      isLeaf: false, // Quận/huyện là cấp cuối (hoặc bạn có thể thêm Phường/Xã)
    }));
  };
  const transformWard = (ward) => {
    return ward.map((ward) => ({
      value: ward.WardCode,
      label: ward.WardName,
      isLeaf: true, //  thêm Phường/Xã)
    }));
  };

  const resetAndCloseModal = () => {
    userForm.resetFields();
    setIsModalOpen(false);
  };
  const handleSubmitBtn = async (values) => {
    const updatedValues = {
      ...values,
      address: residenceLabels,
    };
    console.log("values :>> ", values);
    const res = await createUserAPI(values);
    if (res.data) {
      notification.success({
        message: "Tạo người dùng",
        description: "Tạo người dùng thành công",
      });

      await fetchUser();
      resetAndCloseModal();
    } else {
      const errorMessages = res.error.message;
      notification.error({
        message: "Lỗi tạo người dùng",
        description: Array.isArray(errorMessages) ? (
          <ul>
            {errorMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : (
          errorMessages
        ),
      });
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="mb-4"
        icon={<PlusOutlined />}
      >
        Tạo người dùng
      </Button>
      <Modal
        title="Tạo Người dùng"
        open={isModalOpen}
        onOk={() => {
          userForm.submit();
        }}
        onCancel={resetAndCloseModal}
        maskClosable={false}
      >
        <Form
          form={userForm}
          name="userForm"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 700 }}
          onFinish={handleSubmitBtn}
        >
          <Form.Item
            hasFeedback
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Usernam không được để trống" },
              {
                min: 6,
                message: "Username phải có ít nhất 6 kí tự",
              },
              {
                max: 25,
                message: "Username phải có nhiều nhất 25 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống" },
              {
                type: "email",
                message: "Email không đúng định dạng",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Password  không được để trống" },
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 kí tự",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Họ tên" name="fullName">
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              {
                type: "array",
              },
            ]}
            getValueFromEvent={(value, selectedOptions) => {
              return selectedOptions.map((option) => option.label);
            }}
          >
            <Cascader
              options={options}
              loadData={loadData}
              placeholder="Chọn địa chỉ"
              changeOnSelect
              onChange={(value, selectedOptions) => {
                const labels = selectedOptions.map((option) => option.label);
                setResidenceLabels(labels);
              }}
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                validator: (_, value) => {
                  // Nếu không có giá trị, không báo lỗi (tùy chọn)
                  if (!value) {
                    return Promise.resolve();
                  }

                  // Kiểm tra xem giá trị có phải là số không
                  if (!/^[0-9]+$/.test(value)) {
                    return Promise.reject(
                      new Error("Số điện thoại chỉ được là số")
                    );
                  }

                  // Kiểm tra độ dài sau khi xác nhận là số
                  if (value.length < 10) {
                    return Promise.reject(
                      new Error("Số điện thoại phải có ít nhất 10 ký tự")
                    );
                  }
                  if (value.length > 11) {
                    return Promise.reject(
                      new Error("Số điện thoại phải có nhiều nhất 11 ký tự")
                    );
                  }

                  // Nếu tất cả đều hợp lệ, resolve
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Quyền"
            name="role"
            initialValue="customer"
            rules={[{ required: true, message: "Quyền không được để trống" }]}
          >
            <Select allowClear>
              <Option value="admin">Admin</Option>
              <Option value="customer">Customer</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" initialValue="active">
            <Select allowClear>
              <Option value="active">Hoạt động</Option>
              <Option value="banned">Ngưng hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UserFormComponent;
