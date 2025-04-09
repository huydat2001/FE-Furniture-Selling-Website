import { useState, useRef, useEffect } from "react";
import { Carousel } from "antd";
import { getAllDiscountAPI } from "../../services/api.serivice.discount";
import "../../assets/coupon.css";

const CouponComponent = () => {
  const [isCopied, setIsCopied] = useState(null);
  const cpnCodeRefs = useRef({});
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const filter = { status: "active" };
        const res = await getAllDiscountAPI(1, 6, filter);
        setDiscounts(res.data.result);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setIsCopied(code);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không thời hạn";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Nhóm 3 coupon vào 1 slide
  const groupCoupons = (coupons, groupSize) => {
    const grouped = [];
    for (let i = 0; i < coupons.length; i += groupSize) {
      grouped.push(coupons.slice(i, i + groupSize));
    }
    return grouped;
  };

  const groupedDiscounts = groupCoupons(discounts, 3);

  return (
    <div className="coupon-section">
      <h2 className="coupon-title">Phiếu giảm giá dành cho bạn</h2>
      <div className="coupon-container">
        {discounts.length > 0 ? (
          <Carousel dots autoplay draggable infinite arrows>
            {groupedDiscounts.map((group, index) => (
              <div key={index} className="coupon-slide">
                <div className="coupon-group">
                  {group.map((dis) => (
                    <div key={dis._id} className="coupon-card">
                      <h3>
                        {dis.type === "percentage"
                          ? `Giảm ${dis.value}%`
                          : `Giảm ${dis.value.toLocaleString("vi-VN")} VND`}
                      </h3>
                      <div className="coupon-row">
                        <span
                          ref={(el) => (cpnCodeRefs.current[dis.code] = el)}
                          className="cpn-code"
                        >
                          {dis.code}
                        </span>
                        <button
                          onClick={() => handleCopy(dis.code)}
                          className={`cpn-btn ${
                            isCopied === dis.code ? "copied" : ""
                          }`}
                        >
                          {isCopied === dis.code ? "ĐÃ COPY!" : "COPY MÃ"}
                        </button>
                      </div>
                      <p className="valid-date">
                        Hết hạn: {formatDate(dis.endDate)}
                      </p>
                      <div className="circle1"></div>
                      <div className="circle2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="no-coupons">Hiện tại không có phiếu giảm giá nào.</p>
        )}
      </div>
    </div>
  );
};

export default CouponComponent;
