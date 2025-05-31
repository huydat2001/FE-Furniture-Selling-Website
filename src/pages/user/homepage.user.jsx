import { Carousel } from "antd";
import CouponComponent from "../../components/coupon/coupon";
import HotDealComponent from "../../components/product/user/hotdeal.product";
import NewProductComponent from "../../components/product/user/new.product";
import AllProductComponent from "../../components/product/user/all.product";

const HomePage = () => {
  //cũ
  return (
    <>
      <h1 className="text-4xl my-5 font-semibold">Mới</h1>
      <NewProductComponent />
      <CouponComponent />
      <h1 className="text-4xl my-5 font-semibold">Sản phẩm yêu thích</h1>
      <HotDealComponent />
      <h1 className="text-2xl my-5 font-semibold">Tất cả sản phẩm</h1>
      <AllProductComponent />
    </>
  );
};

export default HomePage;
