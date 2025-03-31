import { Cascader, Form, Input, Modal, notification, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import {
  getAllCategoryAPI,
  updateCategoryAPI,
} from "../../services/api.service.category";

const CategoryUpdateFormComponent = (props) => {
  const [optionCategory, setOptionCategory] = useState([]);
  const {
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataDetail,
    setDataDetail,
    fetchCategory,
  } = props;
  useEffect(() => {
    onFill();
    getCategory();
  }, [isModalUpdateOpen]);
  const [categoryForm] = Form.useForm();
  const { Option } = Select;

  const resetAndCloseModal = () => {
    categoryForm.resetFields();
    setIsModalUpdateOpen(false);
  };
  const onFill = () => {
    if (dataDetail) {
      categoryForm.setFieldsValue({
        id: dataDetail._id,
        name: dataDetail.name,
        description: dataDetail.description,
        parent: dataDetail.parent?._id || undefined,
        status: dataDetail.status,
      });
    }
  };
  const getCategory = async () => {
    const res = await getAllCategoryAPI();
    const options = res.data.result
      .map((category) => ({
        value: category._id,
        label: category.name,
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, "vi", { sensitivity: "base" })
      );
    setOptionCategory(options);
  };
  const handleUpdate = async (values) => {
    const res = await updateCategoryAPI(values);
    if (res.data) {
      notification.success({
        message: "Cập nhật danh mục",
        description: "Cập nhật danh mục thành công",
      });
      setIsModalUpdateOpen(false);
      await fetchCategory();
    } else {
      const errorMessages = res.error.message;
      notification.error({
        message: "Lỗi tạo danh mục",
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
        title={<div className="text-center">Chỉnh sửa danh mục</div>}
        open={isModalUpdateOpen}
        onOk={() => {
          categoryForm.submit();
        }}
        onCancel={resetAndCloseModal}
        maskClosable={false}
      >
        <Form
          form={categoryForm}
          name="userForm"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 700 }}
          onFinish={handleUpdate}
          //   onFinishFailed={onFinishFailed}
        >
          <Form.Item label="ID" name="id">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Tên danh mục không được để trống" },
              {
                max: 100,
                message: "Tên danh mục phải có nhiều nhất 100 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea />
          </Form.Item>

          <Form.Item label="Danh mục cha" name="parent">
            <Select
              allowClear
              options={optionCategory}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            ></Select>
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" initialValue="active">
            <Select allowClear>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Ngưng hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default CategoryUpdateFormComponent;
