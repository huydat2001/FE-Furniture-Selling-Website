import ProductListComponent from "./product.list";

const NewProductComponent = () => {
  const filter = {
    populate: "category,discounts",
  };

  return (
    <ProductListComponent filter={filter} badgeText="Mới" badgeColor="green" />
  );
};
export default NewProductComponent;
