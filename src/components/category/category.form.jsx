import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  Form,
  Input,
  Modal,
  notification,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import {
  createCategoryAPI,
  getAllCategoryAPI,
} from "../../services/api.service.category";

const CategoryFormComponent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryForm] = Form.useForm();
  const { fetchCategory } = props;
  const [optionCategory, setOptionCategory] = useState([]);
  useEffect(() => {
    getCategory();
  }, [fetchCategory]);
  const { Option } = Select;

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
  const resetAndCloseModal = () => {
    categoryForm.resetFields();
    setIsModalOpen(false);
  };
  const handleSubmitBtn = async (value) => {
    const res = await createCategoryAPI(value);
    if (res.data) {
      notification.success({
        message: "Tạo thành công",
        description: "Tạo danh mục thành công",
      });

      // await fetchUser();
      resetAndCloseModal();
      fetchCategory();
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
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="mb-4"
        icon={<PlusOutlined />}
      >
        Tạo danh mục
      </Button>
      <Modal
        title={<div className="text-center">Tạo danh mục mới</div>}
        open={isModalOpen}
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
          onFinish={handleSubmitBtn}
          //   onFinishFailed={onFinishFailed}
        >
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
export default CategoryFormComponent;
