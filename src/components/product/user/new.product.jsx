import ProductListComponent from "./product.list";

const NewProductComponent = () => {
  const filter = {
    populate: "category,discounts",
  };

  return (
    <ProductListComponent
      filter={filter}
      badgeText="Mới"
      badgeColor="green"
      pageSize={12} // Cố định 12 sản phẩm
      enablePagination={false}
    />
  );
};
export default NewProductComponent;
