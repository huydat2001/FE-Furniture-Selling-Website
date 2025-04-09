import {
  Breadcrumb,
  Card,
  Col,
  notification,
  Row,
  Typography,
  Upload,
} from "antd";
import { Link } from "react-router-dom";
import ProductFormComponent from "../../components/product/product.form";
import { useEffect, useState } from "react";
import ProductTableComponent from "../../components/product/product.table";
import { getAllProductAPI } from "../../services/api.service.product";
import { PlusOutlined } from "@ant-design/icons";
import { getAllCategoryAPI } from "../../services/api.service.category";
import { getAllBrandAPI } from "../../services/api.service.brand";
import { getAllDiscountAPI } from "../../services/api.serivice.discount";
const { Title } = Typography;
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const uploadButton = (
  <button style={{ border: 0, background: "none" }} type="button">
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
);
const ProductPage = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [optionCategory, setOptionCategory] = useState([]);
  const [optionBrand, setOptionBrand] = useState([]);
  const [optionDiscount, setOptionDiscount] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [current, pageSize]);
  const filter = { status: "active" };
  const getCategory = async () => {
    const res = await getAllCategoryAPI(null, null, filter);
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
    const res = await getAllBrandAPI(null, null, filter);
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
    const res = await getAllDiscountAPI(null, null, filter);
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
  const fetchProduct = async () => {
    const res = await getAllProductAPI(current, pageSize);
    if (res.data) {
      setData(res.data.result);
      setTotal(res.data.pagination.total);
      setLoading(false);
    }
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList([...newFileList]);
  };
  const handlePreview = (file) =>
    __awaiter(void 0, void 0, void 0, function* () {
      if (!file.url && !file.preview) {
        file.preview = yield getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    });
  const uploadProps = {
    onChange: handleChange,
    fileList,
    beforeUpload: (file) => {
      const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      if (!isImage) {
        notification.error({
          message: "Lỗi",
          description: "Chỉ cho phép upload file ảnh (JPEG, PNG, JPG)",
        });
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        notification.error({
          message: "Lỗi",
          description: "File ảnh phải nhỏ hơn 5MB",
        });
      }
      return isImage && isLt5M ? false : Upload.LIST_IGNORE; // Không upload tự động
    },
    showUploadList: {
      showRemoveIcon: true,
    },
    // Giới hạn 1 file
    customRequest: dummyRequest,
    listType: "picture-card",
    onPreview: handlePreview,
  };
  return (
    <>
      <div className="p-3 bg-gray-100 min-h-screen">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6"
          items={[
            {
              title: <Link to="/">Dashboard</Link>,
            },
            {
              title: "Management",
            },
            {
              title: "Sản phẩm",
            },
          ]}
        />

        {/* Page Header */}
        <Card className="mb-6" style={{ borderRadius: "8px" }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} lg={12}>
              <Title level={3} className="mb-0">
                Quản lý sản phẩm
              </Title>
              <p className="text-gray-500">
                Thêm, chỉnh sửa và quản lý danh sách sản phẩm.
              </p>
            </Col>
            <Col xs={24} lg={6}>
              <Card
                title="Thêm sản phẩm"
                style={{ borderRadius: "8px" }}
                styles={{ body: { padding: "16px" } }}
                className="text-center"
              >
                <ProductFormComponent
                  fetchProduct={fetchProduct}
                  previewOpen={previewOpen}
                  setPreviewOpen={setPreviewOpen}
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                  fileList={fileList}
                  setFileList={setFileList}
                  handlePreview={handlePreview}
                  dummyRequest={dummyRequest}
                  uploadProps={uploadProps}
                  uploadButton={uploadButton}
                  //
                  optionCategory={optionCategory}
                  optionBrand={optionBrand}
                  optionDiscount={optionDiscount}
                  //
                  getBrand={getBrand}
                  getCategory={getCategory}
                  getDiscount={getDiscount}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* User Form and Table */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <Card
              title="Danh sách sản phẩm"
              style={{ borderRadius: "8px" }}
              styles={{ body: { padding: "16px" } }}
            >
              <ProductTableComponent
                data={data}
                current={current}
                setCurrent={setCurrent}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                loading={loading}
                fetchProduct={fetchProduct}
                previewOpen={previewOpen}
                setPreviewOpen={setPreviewOpen}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                fileList={fileList}
                setFileList={setFileList}
                uploadProps={uploadProps}
                uploadButton={uploadButton}
                //
                optionCategory={optionCategory}
                optionBrand={optionBrand}
                optionDiscount={optionDiscount}
                filter={filter}
                getBrand={getBrand}
                getCategory={getCategory}
                getDiscount={getDiscount}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ProductPage;
