import {
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { updateProductAPI } from "../../services/api.service.product";
import { handleUploadFileMultiple } from "../../services/upload/api.upload";
import { getAllBrandAPI } from "../../services/api.service.brand";
import { getAllCategoryAPI } from "../../services/api.service.category";
import { getAllDiscountAPI } from "../../services/api.serivice.discount";

const ProductUpdateFormComponent = (props) => {
  const {
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    dataDetail,
    fetchProduct,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    fileList,
    setFileList,
    uploadProps,
    uploadButton,
    //
    optionCategory,
    setOptionCategory,
    optionBrand,
    setOptionBrand,
    optionDiscount,
    setOptionDiscount,
  } = props;
  const [productForm] = Form.useForm();
  useEffect(() => {
    onFill();
    getBrand();
    getCategory();
    getDiscount();
  }, [isModalUpdateOpen]);
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
  const getBrand = async () => {
    const res = await getAllBrandAPI();
    const options = res.data.result
      .map((brand) => ({
        value: brand._id,
        label: brand.name,
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, "vi", { sensitivity: "base" })
      );
    setOptionBrand(options);
  };
  const getDiscount = async () => {
    const res = await getAllDiscountAPI();
    const options = res.data.result
      .map((dis) => ({
        value: dis._id,
        label: dis.code,
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, "vi", { sensitivity: "base" })
      );
    setOptionDiscount(options);
  };
  const resetAndCloseModal = () => {
    productForm.resetFields();
    setIsModalUpdateOpen(false);
    setFileList([]);
  };
  const onFill = () => {
    if (dataDetail) {
      productForm.setFieldsValue({
        id: dataDetail._id,
        name: dataDetail.name,
        description: dataDetail.description,
        price: dataDetail.price,
        category: dataDetail.category?._id || dataDetail.category,
        stock: dataDetail.stock,
        brand: dataDetail.brand?._id || dataDetail.brand,
        discounts:
          dataDetail.discounts?.map((discount) => discount._id || discount) ||
          [],
        status: dataDetail.status,
        isFeatured: dataDetail.isFeatured || false,
      });
      if (dataDetail.images && dataDetail.images.length > 0) {
        const images = dataDetail.images.map((img, index) => ({
          uid: `-${index + 1}`, // ID duy nhất cho mỗi ảnh
          name: img.name, // Tên file
          status: "done", // Trạng thái upload
          url: `${import.meta.env.VITE_BACKEND_URL}/images/product/${img.name}`, // URL của ảnh
        }));
        setFileList(images);
      } else {
        setFileList([]); // Nếu không có ảnh, đặt fileList rỗng
      }
    }
  };
  const handleUpdate = async (values) => {
    try {
      const {
        id,
        name,
        description,
        price,
        category,
        stock,
        brand,
        discounts,
        status,
        isFeatured,
      } = values;
      // mới
      let images = [];
      const oldImages = fileList
        .filter((file) => !file.originFileObj) // Chỉ lấy ảnh cũ
        .map((file) => ({
          name: file.name,
          public_id: file.name.split(".")[0],
        }));
      const newFiles = fileList
        .filter((file) => file.originFileObj) // Chỉ lấy file mới
        .map((file) => ({ file: file.originFileObj }));
      let newImages = [];
      if (newFiles.length > 0) {
        const resUpload = await handleUploadFileMultiple(newFiles, "product");
        if (resUpload && resUpload.data) {
          newImages = resUpload.data.fileName.map((fileName) => ({
            name: fileName,
            public_id: fileName.split(".")[0],
          }));
        } else {
          throw new Error("Lỗi upload ảnh");
        }
      }
      images = [...oldImages, ...newImages];
      // Nếu không có ảnh nào (cả cũ và mới), giữ nguyên ảnh từ dataDetail
      if (images.length === 0) {
        images = dataDetail.images || [];
      }
      const newValue = {
        id,
        name,
        description,
        price,
        category,
        stock,
        brand,
        discounts: discounts || [],
        status,
        images,
        isFeatured,
      };

      const res = await updateProductAPI(newValue);
      if (res.data) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Cập nhật sản phẩm thành công",
        });
        resetAndCloseModal();
        await fetchProduct(); // Đổi thành fetchProduct nếu cần
      } else {
        throw new Error(res.error.message || "Lỗi từ server");
      }
    } catch (error) {
      notification.error({
        message: "Lỗi cập nhật sản phẩm",
        description: error.message,
      });
    }
  };
  return (
    <>
      <Modal
        title={<div className="text-center">Chỉnh sửa sản phẩm</div>}
        open={isModalUpdateOpen}
        onOk={() => productForm.submit()}
        onCancel={resetAndCloseModal}
        maskClosable={false}
        okText="Tạo"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={productForm}
          name="updateForm"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          onFinish={handleUpdate}
          initialValues={{ status: "active" }} // Giá trị mặc định
        >
          <Form.Item label="ID" name="id">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: "Tên sản phẩm không được để trống" },
              {
                whitespace: true,
                message: "Tên không được chỉ chứa khoảng trắng",
              },
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả sản phẩm (tùy chọn)"
            />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Giá không được để trống" },
              {
                type: "number",
                min: 0,
                message: "Giá phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              suffix="VNĐ"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập giá (VNĐ)"
            />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select
              allowClear
              options={optionCategory}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Chọn danh mục"
            ></Select>
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Tồn kho"
            name="stock"
            rules={[
              {
                required: true,
                message: "Số lượng tồn kho không được để trống",
              },
              {
                type: "number",
                min: 0,
                message: "Tồn kho phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số lượng tồn kho"
            />
          </Form.Item>

          <Form.Item label="Thương hiệu" name="brand">
            <Select
              placeholder="Chọn thương hiệu (tùy chọn)"
              allowClear
              options={optionBrand}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            ></Select>
          </Form.Item>

          <Form.Item label="Mã giảm giá" name="discounts">
            <Select
              mode="multiple"
              placeholder="Chọn mã giảm giá (tùy chọn)"
              allowClear
              options={optionDiscount}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            ></Select>
          </Form.Item>
          <Form.Item label="Nổi bật" valuePropName="checked" name="isFeatured">
            <Switch />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngưng hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="images"
            rules={[
              () => ({
                validator(_, value) {
                  return fileList.length > 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Vui lòng upload ít nhất 1 ảnh")
                      );
                },
              }),
            ]}
          >
            <Upload {...uploadProps}>
              {fileList.length >= Infinity ? null : uploadButton}
            </Upload>
          </Form.Item>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form>
      </Modal>
    </>
  );
};
export default ProductUpdateFormComponent;
