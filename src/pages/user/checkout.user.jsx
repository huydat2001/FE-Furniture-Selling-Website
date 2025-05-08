import {
  Cascader,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Button,
  notification,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDistrictAPI,
  getProvinceAPI,
  getWardAPI,
} from "../../services/address/api.address";
import { CreateQRCodeAPI } from "../../services/VietQR/api.qrcode";
import { useCart } from "../../contexts/cart.context";
import {
  CreateVNPAYAPI,
  ReturnVNPAYAPI,
} from "../../services/VietQR/api.vnpay";
import {
  getAllDiscountAPI,
  updateDiscountAPI,
} from "../../services/api.serivice.discount";
import { ArrowRightOutlined } from "@ant-design/icons";
import { createOrderAPI } from "../../services/api.service.order";
import { jwtDecode } from "jwt-decode";

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [residenceLabels, setResidenceLabels] = useState([]);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const { cart, totalPrice: cartTotalPrice, clearCart } = useCart();
  const { id } = useParams(); // Lấy id từ URL
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [originalTotalPrice, setOriginalTotalPrice] = useState(0); // Giá trị gốc của đơn hàng
  const [totalPrice, setTotalPrice] = useState(0); // Giá trị sau khi áp dụng giảm giá
  const [code, setCode] = useState(""); // Lưu mã phiếu giảm giá từ input
  const [discount, setDiscount] = useState(null); // Lưu thông tin phiếu giảm giá (nếu hợp lệ)
  const [discountAmount, setDiscountAmount] = useState(0); // Lưu giá trị giảm giá
  const navigate = useNavigate();

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
    if (id) {
      const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));
      if (buyNowProduct && buyNowProduct.id === id) {
        setCheckoutItems([buyNowProduct]);
        const price = buyNowProduct.rawDiscountedPrice * buyNowProduct.quantity;
        setOriginalTotalPrice(price);
        setTotalPrice(price);
      } else {
        notification.error({
          message: "Không tìm thấy sản phẩm",
          description: "Sản phẩm không tồn tại hoặc đã hết thời gian lưu trữ.",
        });
        setCheckoutItems([]);
        setOriginalTotalPrice(0);
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
      setOriginalTotalPrice(cartTotalPrice);
      setTotalPrice(cartTotalPrice);
    }
  }, [id, cart, cartTotalPrice]);

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
              <div>
                <span
                  className={`font-semibold text-red-500 ${
                    discount ? "line-through" : ""
                  }`}
                >
                  {originalTotalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                {discount && (
                  <>
                    <span className="mx-2">
                      <ArrowRightOutlined />
                    </span>
                    <span className="font-semibold text-red-500 ml-2">
                      {totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </>
                )}
              </div>
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

    // Sử dụng totalPrice sau khi trừ mã giảm giá
    const finalPrice = totalPrice;
    getQR(finalPrice, `${name} + ${phone}`);
  };

  const handleApplyDiscount = async () => {
    if (!code) {
      notification.warning({
        message: "Chưa nhập mã giảm giá",
        description: "Vui lòng nhập mã giảm giá trước khi sử dụng.",
      });
      return;
    }

    // Kiểm tra nếu mã giảm giá đã được áp dụng
    if (discount && discount.code === code) {
      notification.warning({
        message: "Mã giảm giá đã được áp dụng",
        description: "Bạn đã áp dụng mã giảm giá này rồi.",
      });
      return;
    }

    try {
      const filter = { status: "active", code: code };
      const response = await getAllDiscountAPI(null, null, filter);
      const checkDis = response.data;

      if (
        !checkDis.statusCode ||
        !checkDis.result ||
        checkDis.result.length === 0
      ) {
        notification.error({
          message: "Mã giảm giá không hợp lệ",
          description: "Mã giảm giá không tồn tại hoặc đã hết hạn.",
        });
        setDiscount(null);
        setDiscountAmount(0);
        setTotalPrice(originalTotalPrice); // Khôi phục totalPrice về giá gốc
        return;
      }

      const discountData = checkDis.result[0]; // Lấy phiếu giảm giá đầu tiên (nếu có)
      const {
        _id,
        type,
        value,
        maxDiscountAmount,
        minOrderValue,
        maxUses,
        usedCount,
        isApplicableToAll,
        applicableProducts,
        startDate,
        endDate,
        status,
      } = discountData;
      console.log("usedCount :>> ", usedCount);

      // Kiểm tra số lần sử dụng
      if (usedCount >= maxUses) {
        notification.error({
          message: "Không thể áp dụng mã giảm giá",
          description: "Mã giảm giá đã hết số lần sử dụng.",
        });
        setDiscount(null);
        setDiscountAmount(0);
        setTotalPrice(originalTotalPrice);
        return;
      }
      // Kiểm tra giá trị đơn hàng tối thiểu
      if (originalTotalPrice < minOrderValue) {
        notification.error({
          message: "Không thể áp dụng mã giảm giá",
          description: `Đơn hàng phải có giá trị tối thiểu ${minOrderValue.toLocaleString(
            "vi-VN",
            { style: "currency", currency: "VND" }
          )} để áp dụng mã này.`,
        });
        setDiscount(null);
        setDiscountAmount(0);
        setTotalPrice(originalTotalPrice);
        return;
      }
      // Kiểm tra sản phẩm áp dụng
      if (id) {
        const applicableProductIds = applicableProducts.map((p) =>
          p._id?.toString()
        );
        var hasApplicableProduct = checkoutItems.some((c) =>
          applicableProductIds.includes(c.id?.toString())
        );
      } else if (
        !isApplicableToAll &&
        applicableProducts &&
        applicableProducts.length > 0
      ) {
        const applicableProductIds = applicableProducts.map((p) =>
          p._id?.toString()
        );
        hasApplicableProduct = cart.some((c) =>
          applicableProductIds.includes(c.product._id?.toString())
        );
      }
      if (!hasApplicableProduct) {
        notification.error({
          message: "Không thể áp dụng mã giảm giá",
          description:
            "Không có sản phẩm nào trong đơn hàng áp dụng được mã này.",
        });
        setDiscount(null);
        setDiscountAmount(0);
        setTotalPrice(originalTotalPrice);
        return;
      }
      // Tính giá trị giảm giá
      let discountValue = 0;
      if (type === "percentage") {
        discountValue = (originalTotalPrice * value) / 100;
        if (maxDiscountAmount && discountValue > maxDiscountAmount) {
          discountValue = maxDiscountAmount;
        }
      } else if (type === "fixed") {
        discountValue = value;
      }

      // // Áp dụng giảm giá
      setDiscount(discountData);
      setDiscountAmount(discountValue);
      setTotalPrice(originalTotalPrice - discountValue); // Tính lại totalPrice từ giá gốc
      console.log("usedCount :>> ", usedCount);
      notification.success({
        message: "Áp dụng mã giảm giá thành công",
        description: `Bạn đã được giảm ${discountValue.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}!`,
      });
    } catch (error) {
      console.error("Error applying discount:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi áp dụng mã giảm giá. Vui lòng thử lại.",
      });
      setDiscount(null);
      setDiscountAmount(0);
      setTotalPrice(originalTotalPrice);
    }
  };

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("access_token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const orderData = {
        user: userId,
        totalAmount: totalPrice,

        products: checkoutItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.rawDiscountedPrice,
        })),

        shippingAddress: {
          fullName: values.username,
          phone: values.phone,
          street: values.residence[2] + " " + values.addressDetail,
          city: values.residence[0],
          state: values.residence[1],
        },
        paymentMethod: selectedPaymentMethod,
      };
      if (selectedPaymentMethod !== "vnpay") {
        notification.success({
          message: "Đặt hàng thành công",
          description:
            "Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ với bạn sớm.",
        });
        if (discount) {
          const updatedDiscount = {
            id: discount._id,
            usedCount: (discount.usedCount || 0) + 1,
          };
          await updateDiscountAPI(updatedDiscount);
        }
        if (id) {
          localStorage.removeItem("buyNowProduct"); // Xóa sản phẩm "MUA NGAY"
        } else {
          clearCart(); // Xóa giỏ hàng
        }
        const res = await createOrderAPI(orderData);
        form.resetFields();
        setResidenceLabels([]);
        setSelectedPaymentMethod("cod");
        setQrCodeData(null);
        setCheckoutItems([]);
        setOriginalTotalPrice(0);
        setTotalPrice(0);
        setDiscount(null);
        setDiscountAmount(0);
        setCode("");
        navigate("/");
        return;
      }

      const data = {
        amount: totalPrice, // Sử dụng totalPrice sau khi trừ mã giảm giá
        bankCode: "",
        discountId: discount?._id,
      };
      console.log("orderData :>> ", orderData);

      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
      const res = await CreateVNPAYAPI(data);
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      console.error("Error creating VNPAY payment:", error);
      notification.error({
        message: "Lỗi thanh toán",
        description: "Có lỗi xảy réalisés khi tạo thanh toán VNPAY.",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form lỗi:", errorInfo);
    notification.error({
      message: "Lỗi",
      description: "Vui lòng điền đầy đủ thông tin để đặt hàng.",
    });
  };

  return (
    <>
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
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
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
                    onChange={handleGenerateQR}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
                  />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="residence"
                  rules={[
                    { required: true, message: "Vui lòng chọn địa chỉ!" },
                  ]}
                  getValueFromEvent={(value, selectedOptions) => {
                    const labels = selectedOptions.map(
                      (option) => option.label
                    );
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
                    popupClassName="rounded-lg"
                    style={{
                      height: "48px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                    dropdownRender={(menu) => (
                      <div className="rounded-lg shadow-lg border border-gray-200 bg-white">
                        {menu}
                      </div>
                    )}
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
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-semibold">
                      Phương thức thanh toán
                    </span>
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
                    <div className="flex items-start">
                      <Radio value="bank_account" className="flex items-center">
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
                    </div>
                    {selectedPaymentMethod === "bank_account" && (
                      <div className="ml-10 mt-1 text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
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
                              className="w-48 h-48 mt-2 border border-gray-300 rounded-md mx-auto"
                            />
                            <a
                              href={qrCodeData}
                              download="qr-code.png"
                              className="text-blue-600 hover:underline mt-2 block text-center"
                            >
                              Tải mã QR
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-start">
                      <Radio value="cod" className="flex items-center">
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
                    </div>
                    {selectedPaymentMethod === "cod" && (
                      <p className="text-gray-500 italic text-sm ml-10 mt-1 bg-gray-50 p-4 rounded-lg">
                        Khi nhận hàng vui lòng ký đầy đủ giấy tờ để được bàn
                        giao nội thất
                      </p>
                    )}

                    <div className="flex items-start">
                      <Radio value="vnpay" className="flex items-center">
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
                    </div>
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
                    className="w-full h-12 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out text-white shadow-md"
                  >
                    Đặt Hàng
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <OrderItems items={checkoutItems} totalPrice={totalPrice} />
            <div className="flex items-center gap-3 mt-4">
              <Input
                placeholder="Nhập phiếu giảm giá"
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                type="primary"
                className="h-12 px-6 font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition duration-200 ease-in-out text-white shadow-md"
                onClick={handleApplyDiscount}
              >
                Sử dụng
              </Button>
            </div>
            {discount && (
              <p className="text-green-600 mt-2">
                Đã áp dụng mã giảm giá: {discount.code} (Giảm{" "}
                {discountAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
                )
              </p>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CheckoutPage;
