import { Form, Image, Input, Modal, notification, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import {
  getAllBrandAPI,
  updateBrandAPI,
} from "../../services/api.service.brand";
import { handleUploadFile } from "../../services/upload/api.upload";

const BrandUpdateFormComponent = (props) => {
  const {
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataDetail,
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

  useEffect(() => {
    onFill();
  }, [isModalUpdateOpen]);
  const resetAndCloseModal = () => {
    brandForm.resetFields();
    setIsModalUpdateOpen(false);
    setFileList([]);
  };

  const onFill = () => {
    if (dataDetail) {
      brandForm.setFieldsValue({
        id: dataDetail._id,
        name: dataDetail.name,
        contactEmail: dataDetail.contactEmail,
        contactPhone: dataDetail.contactPhone,
        status: dataDetail.status,
      });
      if (dataDetail.logo) {
        const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/images/logo/${
          dataDetail.logo
        }`;
        setFileList([
          {
            uid: "-1", // ID duy nhất cho file
            name: dataDetail.logo, // Tên file
            status: "done", // Trạng thái upload
            url: imageUrl, // URL của ảnh
          },
        ]);
      } else {
        setFileList([]); // Nếu không có logo, đặt fileList rỗng
      }
    }
  };
  const handleUpdate = async (values) => {
    const { id, name, contactEmail, contactPhone, status } = values;
    const file = fileList[0]?.originFileObj;
    const resUpload = await handleUploadFile(file, "logo");
    if (resUpload) {
      const logo = resUpload.data.fileName;
      const newValue = {
        id,
        name,
        logo,
        contactEmail,
        contactPhone,
        status,
      };
      const res = await updateBrandAPI(newValue);
      if (res.data) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Cập nhật nhãn hàng thành công",
        });
        setIsModalUpdateOpen(false);
        await fetchBrand();
      } else {
        const errorMessages = res.error.message;
        notification.error({
          message: "Lỗi tạo nhãn hàng",
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
      <Modal
        title={<div className="text-center">Chỉnh sửa thương hiệu</div>}
        open={isModalUpdateOpen}
        onOk={() => brandForm.submit()}
        onCancel={resetAndCloseModal}
        maskClosable={false}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form
          form={brandForm}
          name="updateForm"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          style={{ maxWidth: 600 }}
          onFinish={handleUpdate}
          initialValues={{ status: "active" }} // Giá trị mặc định
        >
          <Form.Item label="ID" name="id">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
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
export default BrandUpdateFormComponent;
