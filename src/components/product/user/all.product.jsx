import { useEffect, useState } from "react";
import ProductListComponent from "./product.list";
import { getAllProductAPI } from "../../../services/api.service.product";

const AllProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProductAPI();
        setProducts(res.data?.result || []);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) return <div className="container mx-auto p-4">Đang tải...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <ProductListComponent
      filter={{ populate: "category,discounts" }}
      badgeText=""
      badgeColor=""
    />
  );
};

export default AllProductComponent;
