import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { ReturnVNPAYAPI } from "../../services/VietQR/api.vnpay";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  getAllDiscountAPI,
  updateDiscountAPI,
} from "../../services/api.serivice.discount";
import { createOrderAPI } from "../../services/api.service.order";

const VNPayReturnPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState(null); // Trạng thái: "success", "cancelled", "failed", hoặc null (đang xử lý)
  const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi nếu có
  const [countdown, setCountdown] = useState(3); // Bộ đếm ngược bắt đầu từ 3

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Lấy query params từ URL
        const queryParams = new URLSearchParams(location.search);
        const orderInfo = queryParams.get("vnp_OrderInfo");
        let discountId;
        if (orderInfo && orderInfo.includes("discountId:")) {
          discountId = orderInfo.split("discountId:")[1];
        }

        if (!queryParams.toString()) {
          throw new Error("Không tìm thấy tham số thanh toán.");
        }

        // Gọi API để kiểm tra trạng thái thanh toán
        const response = await ReturnVNPAYAPI(queryParams.toString());
        const { code } = response.data;

        // Xử lý trạng thái thanh toán
        if (code === "00") {
          setStatus("success");
          notification.success({
            message: "Đặt hàng thành công",
            description:
              "Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ với bạn sớm.",
          });
          if (discountId) {
            const filter = { _id: discountId };
            const getDiscount = await getAllDiscountAPI(null, null, filter);
            const discountData = getDiscount.data.result[0];
            const updatedDiscount = {
              id: discountId,
              usedCount: (discountData.usedCount || 0) + 1,
            };
            await updateDiscountAPI(updatedDiscount);
          }
          const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
          if (!pendingOrder) {
            throw new Error("Không tìm thấy thông tin đơn hàng.");
          }
          // Gọi API để tạo đơn hàng
          const res = await createOrderAPI(pendingOrder);
        } else if (code === "24") {
          setStatus("cancelled");
          notification.warning({
            message: "Giao dịch bị hủy",
            description: "Bạn đã hủy giao dịch. Vui lòng thử lại nếu cần.",
          });
        } else {
          setStatus("failed");
          setErrorMessage(`Mã lỗi: ${code}`);
          notification.error({
            message: "Thanh toán thất bại",
            description: `Mã lỗi: ${code}. Vui lòng thử lại.`,
          });
        }
        // Xóa dữ liệu tạm thời trong localStorage
        localStorage.removeItem("pendingOrder");
      } catch (error) {
        console.error("Error checking VNPAY return:", error);
        setStatus("failed");
        setErrorMessage(
          error.message || "Có lỗi xảy ra khi kiểm tra trạng thái thanh toán."
        );
        notification.error({
          message: "Lỗi",
          description:
            error.message ||
            "Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.",
        });
      }
    };

    checkPaymentStatus();
  }, [location]);

  // Xử lý bộ đếm ngược và chuyển hướng
  useEffect(() => {
    if (status) {
      // Đếm ngược từ 3 giây
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Chuyển hướng sau 3 giây
      const redirectTimer = setTimeout(() => {
        navigate("/"); // Chuyển hướng về trang chủ
      }, 3000);

      // Dọn dẹp timer khi component unmount
      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [status, navigate]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* Trạng thái đang xử lý */}
        {!status && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Đang xử lý thanh toán...
            </h1>
            <p className="text-gray-500">Vui lòng chờ trong giây lát.</p>
          </>
        )}

        {/* Thanh toán thành công */}
        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircleOutlined className="text-5xl text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold text-green-600 mb-4">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ với bạn sớm.
            </p>
            <p className="text-gray-500 text-sm">
              Sẽ chuyển hướng về trang chủ trong{" "}
              <span className="font-semibold text-blue-500">{countdown}</span>{" "}
              giây...
            </p>
          </>
        )}

        {/* Giao dịch bị hủy */}
        {status === "cancelled" && (
          <>
            <div className="flex justify-center mb-4">
              <WarningOutlined className="text-5xl text-yellow-500" />
            </div>
            <h1 className="text-2xl font-semibold text-yellow-600 mb-4">
              Giao dịch đã bị hủy
            </h1>
            <p className="text-gray-600 mb-4">
              Bạn đã hủy giao dịch. Vui lòng thử lại nếu cần.
            </p>
            <p className="text-gray-500 text-sm">
              Sẽ chuyển hướng về trang chủ trong{" "}
              <span className="font-semibold text-blue-500">{countdown}</span>{" "}
              giây...
            </p>
          </>
        )}

        {/* Thanh toán thất bại */}
        {status === "failed" && (
          <>
            <div className="flex justify-center mb-4">
              <CloseCircleOutlined className="text-5xl text-red-500" />
            </div>
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-4">
              {errorMessage || "Đã có lỗi xảy ra. Vui lòng thử lại."}
            </p>
            <p className="text-gray-500 text-sm">
              Sẽ chuyển hướng về trang chủ trong{" "}
              <span className="font-semibold text-blue-500">{countdown}</span>{" "}
              giây...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VNPayReturnPage;
