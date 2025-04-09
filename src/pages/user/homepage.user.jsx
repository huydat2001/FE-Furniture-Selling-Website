import CouponComponent from "../../components/coupon/coupon";
import HotDealComponent from "../../components/product/user/hotdeal.product";
import NewProductComponent from "../../components/product/user/new.product";

{
  /* <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            onSearch={(value) => console.log("Search:", value)}
            style={{ maxWidth: "300px" }}
          />
          <Select
            placeholder="Lọc theo danh mục"
            options={[
              { value: "all", label: "Tất cả" },
              { value: "bedroom", label: "Phòng ngủ" },
              { value: "livingroom", label: "Phòng khách" },
            ]}
            onChange={(value) => console.log("Filter:", value)}
            style={{ width: "200px" }}
          />
        </div> */
}
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
