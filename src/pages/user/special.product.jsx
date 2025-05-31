import ProductListComponent from "../../components/product/user/product.list";

const SpecialProduct = () => {
  const filter = {
    populate: "category,discounts",
    status: "active",
    isFeatured: true,
  };
  return (
    <>
      <h1 className="text-4xl my-5 font-semibold">Sản phẩm đặc biệt</h1>
      <ProductListComponent filter={filter} />
    </>
  );
};
export default SpecialProduct;
