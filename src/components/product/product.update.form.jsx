import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Spin,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { updateProductAPI } from "../../services/api.service.product";
import { handleUploadFileMultiple } from "../../services/upload/api.upload";
import { getAllBrandAPI } from "../../services/api.service.brand";
import { getAllCategoryAPI } from "../../services/api.service.category";
import { getAllDiscountAPI } from "../../services/api.serivice.discount";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ProductUpdateFormComponent = (props) => {
  const [isLoading, setIsLoading] = useState(false);

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
    optionBrand,
    optionDiscount,

    getBrand,
    getCategory,
    getDiscount,
  } = props;
  const [productForm] = Form.useForm();
  useEffect(() => {
    if (isModalUpdateOpen) {
      onFill();
      getBrand();
      getCategory();
      getDiscount();
    }
  }, [isModalUpdateOpen]);

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
        decreases: dataDetail.decreases,
        category: dataDetail.category?._id || dataDetail.category,
        stock: dataDetail.stock,
        brand: dataDetail.brand?._id || dataDetail.brand,
        discounts:
          dataDetail.discounts?.map((discount) => discount._id || discount) ||
          [],
        dimensions: {
          length: dataDetail.dimensions?.length,
          width: dataDetail.dimensions?.width,
          height: dataDetail.dimensions?.height,
        },
        weight: dataDetail.weight,
        material: dataDetail.material,
        color: dataDetail.color,
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
        decreases,
        category,
        stock,
        brand,
        discounts,
        status,
        dimensions,
        weight,
        material,
        color,
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
        decreases,
        category,
        stock,
        brand,
        discounts: discounts || [],
        status,
        images,
        dimensions: {
          length: dimensions?.length || 0,
          width: dimensions?.width || 0,
          height: dimensions?.height || 0,
        },
        weight,
        material,
        color: color || [], // Đảm bảo color là mảng
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
        okText="Sửa"
        cancelText="Hủy"
        width={800}
        okButtonProps={{ disabled: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
      >
        <Spin spinning={isLoading}>
          <Form
            form={productForm}
            name="updateForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 800 }}
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
              label="% giảm ban đầu"
              name="decreases"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Giá phải lớn hơn hoặc bằng 0",
                },
                {
                  type: "number",
                  max: 100,
                  message: "Phần trăm giảm giá không được lớn hơn 100",
                },
              ]}
            >
              <InputNumber
                suffix="%"
                style={{ width: "100%" }}
                placeholder="Nhập % giảm giá (tùy chọn)"
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
            <div className="flex gap-x-6">
              <div className="w-1/3">
                <Form.Item
                  label="Chiều dài"
                  name={["dimensions", "length"]}
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Chiều dài phải lớn hơn hoặc bằng 0",
                    },
                  ]}
                  labelCol={{ style: { paddingBottom: 4 } }}
                >
                  <InputNumber suffix="Cm" className="w-full" />
                </Form.Item>
              </div>

              <div className="w-1/3">
                <Form.Item
                  label="Chiều rộng"
                  name={["dimensions", "width"]}
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Chiều rộng phải lớn hơn hoặc bằng 0",
                    },
                  ]}
                  labelCol={{ style: { paddingBottom: 4 } }}
                >
                  <InputNumber suffix="Cm" className="w-full" />
                </Form.Item>
              </div>

              <div className="w-1/3">
                <Form.Item
                  label="Chiều cao"
                  name={["dimensions", "height"]}
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Chiều cao phải lớn hơn hoặc bằng 0",
                    },
                  ]}
                  labelCol={{ style: { paddingBottom: 4 } }}
                >
                  <InputNumber suffix="Cm" className="w-full" />
                </Form.Item>
              </div>
            </div>
            <Form.Item
              label="Cân nặng"
              name="weight"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Cân nặng phải lớn hơn hoặc bằng 0",
                },
              ]}
            >
              <InputNumber
                suffix="Kg"
                style={{ width: "100%" }}
                placeholder="Nhập số cân nặng"
              />
            </Form.Item>
            <Form.Item hasFeedback label="Chất liệu" name="material">
              <Input placeholder="Nhập chất liệu (tùy chọn)" />
            </Form.Item>
            <Form.List name="color">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item label="Màu sắc" required={false} key={field.key}>
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          { required: true, message: "Vui lòng nhập màu sắc" },
                          {
                            whitespace: true,
                            message: "Màu sắc không được để trống",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const colors = getFieldValue("color");
                              const duplicates = colors.filter(
                                (color, i) =>
                                  color === value && i !== field.name
                              );
                              if (duplicates.length > 0) {
                                return Promise.reject(
                                  new Error("Màu sắc không được trùng lặp")
                                );
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="Nhập màu sắc"
                          style={{ width: "60%" }}
                        />
                      </Form.Item>
                      {fields.length > 0 && (
                        <MinusCircleOutlined
                          className="ml-2"
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Form.Item>
                  ))}
                  <Form.Item
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "150%" }}
                      icon={<PlusOutlined />}
                    >
                      Thêm màu sắc
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item
              label="Nổi bật"
              valuePropName="checked"
              name="isFeatured"
            >
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
        </Spin>
      </Modal>
    </>
  );
};
export default ProductUpdateFormComponent;
