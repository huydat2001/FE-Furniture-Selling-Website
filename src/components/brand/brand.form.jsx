import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import { createBrandAPI } from "../../services/api.service.brand";
import { PlusOutlined } from "@ant-design/icons";
import { handleUploadFile } from "../../services/upload/api.upload";

const BrandFormComponent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    fetchBrand,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    fileList,
    setFileList,
    uploadProps,
    uploadButton,
  } = props;
  const [brandForm] = Form.useForm();
  const resetAndCloseModal = () => {
    brandForm.resetFields();
    setIsModalOpen(false);
    setFileList([]);
  };

  const handleSubmitBtn = async (values) => {
    const { name, contactEmail, contactPhone, status } = values;
    const file = fileList[0]?.originFileObj;
    const resUpload = await handleUploadFile(file, "logo");
    if (resUpload) {
      const logo = resUpload.data.fileName;
      const newValue = {
        name,
        logo,
        contactEmail,
        contactPhone,
        status,
      };
      const res = await createBrandAPI(newValue);
      if (res.data) {
        notification.success({
          message: "Tạo thành công",
          description: "Tạo hãng thành công",
        });

        resetAndCloseModal();
        await fetchBrand();
      } else {
        const errorMessages = res.error.message;
        notification.error({
          message: "Lỗi tạo hãng",
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
    } else {
      notification.error({
        message: "Lỗi upload file",
        description: JSON.stringify(resUpload.message),
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
        Tạo hãng
      </Button>
      <Modal
        title={<div className="text-center">Tạo thương hiệu mới</div>}
        open={isModalOpen}
        onOk={() => brandForm.submit()}
        onCancel={resetAndCloseModal}
        maskClosable={false}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form
          form={brandForm}
          name="createForm"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          style={{ maxWidth: 600 }}
          onFinish={handleSubmitBtn}
          initialValues={{ status: "active" }} // Giá trị mặc định
        >
          <Form.Item
            hasFeedback
            label="Tên thương hiệu"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên thương hiệu không được để trống",
              },
              {
                whitespace: true,
                message: "Tên thương hiệu không được chỉ chứa khoảng trắng",
              },
            ]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Email liên hệ"
            name="contactEmail"
            rules={[
              {
                type: "email",
                message: "Email liên hệ phải có định dạng hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập email liên hệ (tùy chọn)" />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Số điện thoại"
            name="contactPhone"
            rules={[
              {
                pattern: /^[0-9]{10,15}$/,
                message:
                  "Số điện thoại phải là số và có độ dài từ 10 đến 15 chữ số",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại (tùy chọn)" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái",
              },
            ]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngưng hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Logo"
            name="logo"
            rules={[
              {
                validator: (_, value) =>
                  fileList.length > 0 ? Promise.resolve() : Promise.resolve(), // Không bắt buộc
              },
            ]}
          >
            <div>
              <Upload {...uploadProps}>
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default BrandFormComponent;
