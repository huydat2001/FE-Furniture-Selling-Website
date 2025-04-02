import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Switch,
} from "antd";
import { useState } from "react";
import { createDiscountAPI } from "../../services/api.serivice.discount";
const { RangePicker } = DatePicker;
const DiscountFormComponent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchDiscount, check, setCheck } = props;
  const [discountForm] = Form.useForm();
  const { Option } = Select;
  const resetAndCloseModal = () => {
    discountForm.resetFields();
    setIsModalOpen(false);
  };
  const handleSubmitBtn = async (values) => {
    const {
      code,
      isApplicableToAll, // Sửa thành isApplicableToAll
      maxUses,
      minOrderValue,
      status,
      type,
      value,
      dateRange, // Lấy dateRange từ values
    } = values;
    const startDate =
      dateRange && dateRange[0] ? dateRange[0].toISOString() : undefined;
    const endDate =
      dateRange && dateRange[1] ? dateRange[1].toISOString() : undefined;
    const newValues = {
      code,
      isApplicableToAll,
      maxUses: maxUses || undefined,
      minOrderValue,
      status,
      type,
      value,
      startDate,
      endDate,
    };
    const res = await createDiscountAPI(newValues);
    if (res.data) {
      notification.success({
        message: "Tạo thành công",
        description: "Tạo phiếu giảm giá thành công",
      });

      // await fetchUser();
      resetAndCloseModal();
      fetchDiscount();
    } else {
      const errorMessages = res.error.message;
      notification.error({
        message: "Lỗi tạo phiếu giảm giá",
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
  const productOptions = [
    { value: "67ea06f38dfe9b816d40e5ef", label: "Sản phẩm A" },
    { value: "67ea06f38dfe9b816d40e5f0", label: "Sản phẩm B" },
  ];
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
        Tạo phiếu giảm
      </Button>
      <Modal
        title={<div className="text-center">Tạo phiếu giảm giá mới</div>}
        open={isModalOpen}
        onOk={() => {
          discountForm.submit();
        }}
        onCancel={resetAndCloseModal}
        maskClosable={false}
      >
        <Form
          form={discountForm}
          name="discountForm"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          style={{ maxWidth: 800 }}
          onFinish={handleSubmitBtn}
          initialValues={{
            status: "active",
            isApplicableToAll: true,
            minOrderValue: 0,
          }}
        >
          {/* Mã giảm giá */}
          <Form.Item
            hasFeedback
            label="Mã giảm giá"
            name="code"
            rules={[
              { required: true, message: "Mã giảm giá không được để trống" },
            ]}
          >
            <Input placeholder="Nhập mã giảm giá (ví dụ: SALE20)" />
          </Form.Item>

          {/* Loại giảm giá */}
          <Form.Item
            label="Loại giảm giá"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
            initialValue="percentage"
          >
            <Select placeholder="Chọn loại giảm giá">
              <Option value="percentage">Phần trăm</Option>
              <Option value="fixed">Cố định</Option>
            </Select>
          </Form.Item>

          {/* Giá trị giảm */}
          <Form.Item
            label="Giá trị giảm"
            name="value"
            rules={[
              { required: true, message: "Giá trị giảm không được để trống" },
              {
                type: "number",
                min: 0,
                message: "Giá trị giảm phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá trị giảm"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          {/* Thời gian áp dụng */}
          <Form.Item
            label="Thời gian"
            name="dateRange"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian áp dụng" },
            ]}
          >
            <DatePicker.RangePicker
              allowEmpty={[false, true]}
              showTime
              format="DD/MM/YYYY HH:mm:ss"
              style={{ width: "100%" }}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            />
          </Form.Item>

          {/* Số lần sử dụng tối đa */}
          <Form.Item
            label="Số lần sử dụng"
            name="maxUses"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Số lần sử dụng tối đa phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số lần sử dụng tối đa (để trống nếu không giới hạn)"
            />
          </Form.Item>

          {/* Giá trị đơn hàng tối thiểu */}
          <Form.Item
            label="Đơn hàng tối thiểu"
            name="minOrderValue"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập giá trị đơn hàng tối thiểu"
            />
          </Form.Item>

          {/* Áp dụng cho tất cả sản phẩm */}
          <Form.Item
            label="Áp dụng tất cả"
            name="isApplicableToAll"
            // valuePropName="checked"
          >
            <Switch
              name="switch"
              checked={check}
              onChange={(checked) => {
                setCheck(checked);
              }}
            />
          </Form.Item>

          {/* Sản phẩm áp dụng */}
          <Form.Item
            label="Sản phẩm áp dụng"
            name="applicableProducts"
            rules={[
              {
                required: !check,
                message:
                  "Vui lòng chọn ít nhất một sản phẩm nếu không áp dụng cho tất cả",
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              options={productOptions}
              showSearch
              disabled={check}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            ></Select>
          </Form.Item>

          {/* Trạng thái */}
          <Form.Item label="Trạng thái" name="status">
            <Select allowClear>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Ngưng hoạt động</Option>
              <Option value="expired">Hết hạn</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default DiscountFormComponent;
