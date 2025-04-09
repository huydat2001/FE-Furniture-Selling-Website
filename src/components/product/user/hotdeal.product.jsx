import ProductListComponent from "./product.list";

const HotDealComponent = () => {
  const filter = {
    populate: "category,discounts",
    sortBy: "decreases",
    order: "desc",
  };
  return (
    <ProductListComponent filter={filter} badgeText="Hot" badgeColor="red" />
  );
};
export default HotDealComponent;
