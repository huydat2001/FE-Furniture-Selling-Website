import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Switch,
} from "antd";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { updateDiscountAPI } from "../../services/api.serivice.discount";

const { Option } = Select;
const DiscountUpdateFormComponent = (props) => {
  const {
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataDetail,
    fetchDiscount,
    setCheck,
    check,
    checkType,
    setCheckType,
    getProduct,
    optionProduct,
    setOptionProduct,
  } = props;

  useEffect(() => {
    onFill();
    //   getCategory();
  }, [isModalUpdateOpen]);
  useEffect(() => {
    getProduct();
  }, [setOptionProduct]);
  const [discountForm] = Form.useForm();
  const resetAndCloseModal = () => {
    discountForm.resetFields();
    setIsModalUpdateOpen(false);
  };
  const onFill = () => {
    if (dataDetail) {
      discountForm.setFieldsValue({
        id: dataDetail._id,
        code: dataDetail.code,
        type: dataDetail.type,
        value: dataDetail.value,
        status: dataDetail.status,
        dateRange: [
          dataDetail.startDate ? dayjs(dataDetail.startDate) : null,
          dataDetail.endDate ? dayjs(dataDetail.endDate) : null,
        ],
        maxUses: dataDetail.maxUses ? dataDetail.maxUses : undefined,
        minOrderValue: dataDetail.minOrderValue,
        isApplicableToAll: dataDetail.isApplicableToAll,
        applicableProducts:
          dataDetail.applicableProducts?.map((pro) => pro._id || pro) || [],
        maxDiscountAmount: dataDetail.maxDiscountAmount,
      });
      setCheck(dataDetail.isApplicableToAll);
    }
  };
  const handleUpdate = async (values) => {
    const {
      id,
      code,
      isApplicableToAll,
      maxUses,
      minOrderValue,
      status,
      type,
      value,
      applicableProducts,
      maxDiscountAmount,
      dateRange, // Lấy dateRange từ values
    } = values;
    const startDate =
      dateRange && dateRange[0] ? dateRange[0].toISOString() : undefined;
    const endDate =
      dateRange && dateRange[1] ? dateRange[1].toISOString() : null;
    const newValues = {
      id,
      code,
      isApplicableToAll,
      maxUses,
      minOrderValue,
      status,
      type,
      value,
      startDate,
      endDate,
      maxDiscountAmount,
      applicableProducts,
    };
    const res = await updateDiscountAPI(newValues);
    if (res.data) {
      notification.success({
        message: "Cập nhật thành công",
        description: "Cập nhật phiếu giảm giá thành công",
      });
      setIsModalUpdateOpen(false);
      await fetchDiscount();
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
  return (
    <>
      <Modal
        title={<div className="text-center">Chỉnh sửa phiếu giảm giá</div>}
        open={isModalUpdateOpen}
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
          onFinish={handleUpdate}
          initialValues={{
            status: "active",
            isApplicableToAll: true,
            minOrderValue: 0,
          }}
        >
          <Form.Item label="ID" name="id">
            <Input disabled={true} />
          </Form.Item>
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
            <Select
              placeholder="Chọn loại giảm giá"
              onChange={(value) => setCheckType(value === "percentage")}
            >
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
          {/* Giá trị giảm tôi đa*/}
          <Form.Item
            label="Giảm tối đa"
            name="maxDiscountAmount"
            rules={[
              {
                required: checkType,
                message: "Giá trị giảm tối đa không được để trống",
              },
              {
                type: "number",
                min: 0,
                message: "Giá trị giảm phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              disabled={!checkType}
              style={{ width: "100%" }}
              placeholder="Nhập giá trị giảm tối đa"
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
              {
                validator: (_, value, callback) => {
                  if (!value || !value[0]) {
                    callback("Vui lòng chọn ngày bắt đầu");
                  } else if (value[1] && value[0].isAfter(value[1])) {
                    callback("Ngày kết thúc phải sau ngày bắt đầu");
                  } else {
                    callback();
                  }
                },
              },
            ]}
            initialValue={[dayjs("2022-01-01"), dayjs("2022-01-15")]}
          >
            <DatePicker.RangePicker
              allowEmpty={[false, true]}
              showTime
              format="DD/MM/YYYY HH:mm:ss"
              style={{ width: "100%" }}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              // selected={date}
            />
          </Form.Item>

          {/* Số lần sử dụng tối đa */}
          <Form.Item
            label="Số lần sử dụng tối đa"
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
              min={0}
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
              options={optionProduct}
              showSearch
              disabled={check}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Chọn sản phẩm"
              notFoundContent="Không tìm thấy sản phẩm"
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
export default DiscountUpdateFormComponent;
