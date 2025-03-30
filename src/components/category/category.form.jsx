import { PlusOutlined } from "@ant-design/icons";
import { Button, Cascader, Form, Input, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

const CategoryFormComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryForm] = Form.useForm();
  const { Option } = Select;

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
        title="Tạo danh mục"
        open={isModalOpen}
        onOk={() => {
          categoryForm.submit();
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        maskClosable={false}
      >
        <Form
          form={categoryForm}
          name="userForm"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 700 }}
          //   onFinish={handleSubmitBtn}
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
            <Input />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" defaultValue="active">
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
