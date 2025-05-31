import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import ProductListComponent from "../../components/product/user/product.list";
import { getProductByQuyeryAPI } from "../../services/api.service.product";
import { getAllCategoryAPI } from "../../services/api.service.category";

const ProductListPage = () => {
  const { id: categoryId } = useParams();
  const location = useLocation();
  const [filter, setFilter] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasProducts, setHasProducts] = useState(true); // State để kiểm tra có sản phẩm không

  useEffect(() => {
    setCategoryName(""); // Reset tên danh mục
    setFilter({});
    setHasProducts(true); // Reset trạng thái sản phẩm

    const fetchCategoryName = async () => {
      setLoading(true);
      setError(null);

      if (!categoryId) {
        setError("Không tìm thấy danh mục. URL hiện tại: " + location.pathname);
        setLoading(false);
        return;
      }

      try {
        const res = await getAllCategoryAPI(null, null, { _id: categoryId });

        if (res.data?.result?.length > 0) {
          const matchedCategory = res.data.result.find(
            (category) => category._id === categoryId
          );
          if (matchedCategory) {
            setCategoryName(matchedCategory.name);
            setFilter({
              category: categoryId,
              status: "active",
            });

            // Kiểm tra số lượng sản phẩm
            const productRes = await getProductByQuyeryAPI(1, 1000, {
              category: categoryId,
              status: "active",
            });
            if (productRes.data?.result?.length === 0) {
              setHasProducts(false);
            }
          } else {
            setError(
              `Danh mục với ID ${categoryId} không tồn tại trong dữ liệu trả về`
            );
          }
        } else {
          setError("Không có danh mục nào được trả về từ API");
        }
      } catch (err) {
        console.error("Error fetching category name:", err);
        setError("Không thể tải thông tin danh mục: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryName();
  }, [categoryId, location.pathname]);

  if (loading) return <div className="container mx-auto p-4">Đang tải...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Sản phẩm thuộc danh mục: {categoryName || "Không xác định"}
      </h1>
      {!hasProducts && (
        <div className="container mx-auto p-4 text-yellow-500">
          Hiện tại danh mục này chưa có sản phẩm nào.
        </div>
      )}
      <ProductListComponent
        filter={filter}
        badgeText={categoryName || "Danh mục"}
        badgeColor={categoryId ? "blue" : "default"}
      />
    </div>
  );
};

export default ProductListPage;
