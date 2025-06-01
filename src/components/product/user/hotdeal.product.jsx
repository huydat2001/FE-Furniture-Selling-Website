import ProductListComponent from "./product.list";

const HotDealComponent = () => {
  const filter = {
    populate: "category,discounts",
    sortBy: "decreases",
    order: "desc",
  };
  return (
    <ProductListComponent
      filter={filter}
      badgeText="Hot"
      badgeColor="red"
      pageSize={12} // Cố định 12 sản phẩm
      enablePagination={false}
    />
  );
};
export default HotDealComponent;
