import { Carousel } from "antd";
import CouponComponent from "../../components/coupon/coupon";
import HotDealComponent from "../../components/product/user/hotdeal.product";
import NewProductComponent from "../../components/product/user/new.product";

const HomePage = () => {
  //cũ
  return (
    <>
      <h1 className="text-4xl my-5 font-semibold">New</h1>
      <NewProductComponent />
      <CouponComponent />
      <h1 className="text-4xl my-5 font-semibold">Hot Deal</h1>
      <HotDealComponent />
      <h1 className="text-2xl my-5 font-semibold">Đánh giá thực tế</h1>
    </>
  );
};

export default HomePage;
