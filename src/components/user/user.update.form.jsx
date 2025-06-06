import { Cascader, Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { updateUserAPI } from "../../services/api.service.user";
import {
  getDistrictAPI,
  getProvinceAPI,
  getWardAPI,
} from "../../services/address/api.address";

const UserUpDateFormComponent = (props) => {
  const {
    dataUpdate,
    setDataUpdate,
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    fetchUser,
  } = props;
  const [residenceLabels, setResidenceLabels] = useState([]);
  const [options, setOptions] = useState([]);

  const [updateForm] = Form.useForm();
  useEffect(() => {
    onFill();
  }, [dataUpdate]);
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
  const transformProvinces = (provinces) => {
    return provinces.map((province) => ({
      value: province.ProvinceID,
      label: province.ProvinceName,
      isLeaf: false, // Cho phép tải dữ liệu con (huyện)
    }));
  };
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
  const onFill = () => {
    if (dataUpdate) {
      updateForm.setFieldsValue({
        id: dataUpdate._id,
        password: dataUpdate.password,
        fullName: dataUpdate.fullName,
        phone: dataUpdate.phone,
        role: dataUpdate.role,
      });
    }
  };
  const handleUpdate = async (values) => {
    const res = await updateUserAPI(values);
    if (res.data) {
      notification.success({
        message: "Cập nhật người dùng",
        description: "Cập nhật người dùng thành công",
      });
      setIsModalUpdateOpen(false);
      await fetchUser();
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
      <Modal
        title="Chỉnh sửa Người dùng"
        open={isModalUpdateOpen}
        onOk={() => {
          updateForm.submit();
        }}
        okText="Sửa"
        onCancel={() => {
          setIsModalUpdateOpen(false);
        }}
        maskClosable={false}
      >
        <Form
          form={updateForm}
          name="userUpdateForm"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 700 }}
          onFinish={handleUpdate}
          autoComplete="off"
        >
          <Form.Item label="ID" name="id">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
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
                // setResidenceLabels(labels);
              }}
            />
          </Form.Item>

          <Form.Item
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
            label="Quyền"
            name="role"
            rules={[{ required: true, message: "Quyền không được để trống" }]}
          >
            <Select allowClear>
              <Option value="admin">Admin</Option>
              <Option value="customer">Customer</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UserUpDateFormComponent;
