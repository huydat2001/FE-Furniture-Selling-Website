// file: checkout.user.jsx
import {
  Cascader,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Button,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getDistrictAPI,
  getProvinceAPI,
  getWardAPI,
} from "../../services/address/api.address";
import { CreateQRCodeAPI } from "../../services/VietQR/api.qrcode";
import { useCart } from "../../contexts/cart.context";

// Component hiển thị danh sách sản phẩm (giỏ hàng hoặc sản phẩm "MUA NGAY")
const OrderItems = ({ items, totalPrice }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Thông Tin Đơn Hàng
      </h2>
      {items && items.length > 0 ? (
        <>
          {items.map((item, index) => (
            <Row
              key={item.id || index}
              gutter={[12, 12]}
              className="mb-4 border-b pb-4"
            >
              <Col span={6}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-20 object-cover rounded-md"
                />
              </Col>
              <Col span={18}>
                <p className="font-semibold text-gray-700">{item.name}</p>
                <p className="text-gray-500">
                  Màu sắc: {item.color || "Chưa chọn"}
                </p>
                <p className="text-gray-500">Số lượng: {item.quantity}</p>
                <p className="text-red-500 font-semibold">
                  {(item.rawDiscountedPrice * item.quantity).toLocaleString(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )}
                </p>
              </Col>
            </Row>
          ))}
          <div className="flex justify-between py-3 border-t border-gray-200">
            <span className="font-semibold text-gray-700">Tổng tiền:</span>
            <span className="font-semibold text-red-500">
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">
          Không có sản phẩm nào trong đơn hàng.
        </p>
      )}
    </div>
  );
};

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [residenceLabels, setResidenceLabels] = useState([]);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const { cart, totalPrice: cartTotalPrice, clearCart } = useCart();
  const { id } = useParams(); // Lấy id từ URL
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvinceAPI();
        const provinces = transformProvinces(response.data);
        setOptions(provinces);
      } catch (error) {
        console.error("Lỗi khi lấy tỉnh/thành:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách tỉnh/thành phố.",
        });
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    // Kiểm tra nếu có id (tức là từ "MUA NGAY")
    if (id) {
      const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));
      if (buyNowProduct && buyNowProduct.id === id) {
        setCheckoutItems([buyNowProduct]);
        setTotalPrice(
          buyNowProduct.rawDiscountedPrice * buyNowProduct.quantity
        );
      } else {
        // Nếu không tìm thấy sản phẩm trong localStorage, có thể điều hướng về trang chủ hoặc hiển thị lỗi
        notification.error({
          message: "Không tìm thấy sản phẩm",
          description: "Sản phẩm không tồn tại hoặc đã hết thời gian lưu trữ.",
        });
        setCheckoutItems([]);
        setTotalPrice(0);
      }
    } else {
      // Nếu không có id, hiển thị giỏ hàng
      const cartItems = cart.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        rawPrice: item.product.price,
        rawDiscountedPrice:
          item.product.decreases > 0
            ? item.product.price -
              (item.product.price * item.product.decreases) / 100
            : item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        image:
          item.product?.images?.length > 0
            ? `${import.meta.env.VITE_BACKEND_URL}/images/product/${
                item.product.images[0]?.name
              }`
            : "/default-image.jpg",
      }));
      setCheckoutItems(cartItems);
      setTotalPrice(cartTotalPrice);
    }
  }, [id, cart, cartTotalPrice]);

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      if (selectedOptions.length === 1) {
        const provinceId = targetOption.value;
        const response = await getDistrictAPI(provinceId);
        const districts = transformDistricts(response.data);
        targetOption.loading = false;
        targetOption.children = districts;
      } else if (selectedOptions.length === 2) {
        const districtId = targetOption.value;
        const response = await getWardAPI(districtId);
        const wards = transformWard(response.data);
        targetOption.loading = false;
        targetOption.children = wards;
      }
      setOptions([...options]);
    } catch (error) {
      targetOption.loading = false;
      console.error("Lỗi khi tải dữ liệu:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu địa chỉ.",
      });
    }
  };

  const transformProvinces = (provinces) => {
    return provinces.map((province) => ({
      value: province.ProvinceID,
      label: province.ProvinceName,
      isLeaf: false,
    }));
  };

  const transformDistricts = (districts) => {
    return districts.map((district) => ({
      value: district.DistrictID,
      label: district.DistrictName,
      isLeaf: false,
    }));
  };

  const transformWard = (wards) => {
    return wards.map((ward) => ({
      value: ward.WardCode,
      label: ward.WardName,
      isLeaf: true,
    }));
  };

  const getQR = async (total, message) => {
    try {
      const data = {
        total: total || 0,
        message: message || "Thanh toan don hang",
      };
      const res = await CreateQRCodeAPI(data);
      setQrCodeData(res.data.data.qrDataURL);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tạo mã QR. Vui lòng thử lại.",
      });
    }
  };

  const onFinish = (values) => {
    const orderData = {
      ...values,
      address: residenceLabels.join(", "),
      totalPrice: totalPrice,
      paymentMethod: selectedPaymentMethod,
      items: checkoutItems,
      createdAt: new Date().toISOString(),
    };

    console.log("Thông tin đặt hàng:", orderData);

    notification.success({
      message: "Đặt hàng thành công",
      description: "Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ với bạn sớm.",
    });

    // Xóa dữ liệu sau khi đặt hàng thành công
    if (id) {
      localStorage.removeItem("buyNowProduct"); // Xóa sản phẩm "MUA NGAY"
    } else {
      clearCart(); // Xóa giỏ hàng
    }

    form.resetFields();
    setResidenceLabels([]);
    setSelectedPaymentMethod("cod");
    setQrCodeData(null);
    setCheckoutItems([]);
    setTotalPrice(0);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form lỗi:", errorInfo);
    notification.error({
      message: "Lỗi",
      description: "Vui lòng điền đầy đủ thông tin để đặt hàng.",
    });
  };

  const handleGenerateQR = () => {
    const phone = form.getFieldValue("phone");
    const name = form.getFieldValue("username");

    if (!phone) {
      notification.warning({
        message: "Chưa nhập số điện thoại",
        description: "Vui lòng nhập số điện thoại để tạo mã QR.",
      });
      setQrCodeData(null);
      return;
    }

    if (!name) {
      notification.warning({
        message: "Chưa nhập Họ tên",
        description: "Vui lòng nhập Họ tên để tạo mã QR.",
      });
      setQrCodeData(null);
      return;
    }

    getQR(totalPrice, `${name} + ${phone}`);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-10 text-center">
        Thanh Toán
      </h1>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={14}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Thông Tin Khách Hàng
            </h2>
            <Form
              form={form}
              name="checkout"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 800 }}
              initialValues={{ transport: "cod" }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Họ và Tên"
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input
                  placeholder="Nhập họ và tên"
                  onChange={handleGenerateQR}
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{9,15}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  className="w-full"
                  onChange={handleGenerateQR}
                />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="residence"
                rules={[{ required: true, message: "Vui lòng chọn địa chỉ!" }]}
                getValueFromEvent={(value, selectedOptions) => {
                  const labels = selectedOptions.map((option) => option.label);
                  setResidenceLabels(labels);
                  return labels;
                }}
              >
                <Cascader
                  options={options}
                  loadData={loadData}
                  placeholder="Chọn Tỉnh/Thành, Quận/Huyện, Phường/Xã"
                  changeOnSelect
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                label="Địa chỉ chi tiết"
                name="addressDetail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ chi tiết!",
                  },
                ]}
              >
                <Input
                  placeholder="Số nhà, tên đường,..."
                  className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-semibold">Phương thức thanh toán</span>
                }
                name="transport"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phương thức thanh toán!",
                  },
                ]}
              >
                <Radio.Group
                  className="flex flex-col gap-4"
                  onChange={(e) => {
                    const method = e.target.value;
                    setSelectedPaymentMethod(method);
                    if (method === "bank_account") {
                      handleGenerateQR();
                    } else {
                      setQrCodeData(null);
                    }
                  }}
                >
                  <div>
                    <Radio value="bank_account" className="flex items-start">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/888/888162.png"
                          alt="Bank Icon"
                          className="w-6 h-6"
                        />
                        <span className="text-gray-700">
                          Thanh toán chuyển khoản qua ngân hàng
                        </span>
                      </div>
                    </Radio>
                    {selectedPaymentMethod === "bank_account" && (
                      <div className="ml-10 mt-1 text-gray-500 text-sm">
                        <p className="italic">Tên tài khoản: NGUYEN HUY DAT</p>
                        <p className="mt-1">Số tài khoản: 102873114863</p>
                        <p className="mt-1">Ngân hàng: ViettinBank</p>
                        <p className="mt-1">Nội dung: Tên + SĐT đặt hàng</p>
                        {qrCodeData && (
                          <div className="mt-2">
                            <p className="text-gray-700 font-semibold">
                              Quét mã QR để thanh toán:
                            </p>
                            <img
                              src={qrCodeData}
                              alt="QR Code"
                              className="w-96 h-96 mt-2 border border-gray-300 rounded-md "
                            />
                            <a
                              href={qrCodeData}
                              download="qr-code.png"
                              className="text-blue-600 hover:underline mt-2 block"
                            >
                              Tải mã QR
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Radio value="cod" className="flex items-start">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/888/888162.png"
                          alt="POS Icon"
                          className="w-6 h-6"
                        />
                        <span className="text-gray-700">
                          Thanh toán khi giao hàng
                        </span>
                      </div>
                    </Radio>
                    {selectedPaymentMethod === "cod" && (
                      <p className="text-gray-500 italic text-sm ml-10 mt-1">
                        Khi nhận hàng vui lòng ký đầy đủ giấy tờ để được bàn
                        giao nội thất
                      </p>
                    )}
                  </div>

                  <Radio value="vnpay" className="flex items-start">
                    <div className="flex items-center gap-2">
                      <img
                        src="/image/vnpay.png"
                        alt="VNPay Logo"
                        className="w-6 h-6"
                      />
                      <span className="text-gray-700">
                        Thanh toán online qua cổng VNPay
                        <span className="text-gray-500 text-sm ml-1">
                          (ATM/Visa/QR Pay trên Internet Banking)
                        </span>
                      </span>
                    </div>
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  xs: { offset: 0, span: 24 },
                  sm: { offset: 0, span: 24 },
                  md: { offset: 8, span: 16 },
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 font-semibold rounded-md bg-blue-600 hover:bg-blue-700"
                >
                  Đặt Hàng
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col xs={24} md={10}>
          <OrderItems items={checkoutItems} totalPrice={totalPrice} />
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
