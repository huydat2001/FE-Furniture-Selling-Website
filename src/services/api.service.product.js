import axios from "./axios.customize";
const getAllProductAPI = (current, pageSize, filter = {}) => {
  let params = new URLSearchParams();
  if (current && pageSize) {
    params.append("page", current);
    params.append("limit", pageSize);
  }
  // Thêm filter
  if (filter.status) {
    params.append("status", filter.status);
  }

  let URL_BACKEND = `/v1/api/product?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
const createProductAPI = (value) => {
  const URL_BACKEND = "/v1/api/product";
  return axios.post(URL_BACKEND, value);
};
const updateProductAPI = (value) => {
  const URL_BACKEND = "/v1/api/product";
  return axios.put(URL_BACKEND, value);
};
const deleteProductAPI = (id) => {
  const URL_BACKEND = `/v1/api/product/${id}`;
  return axios.delete(URL_BACKEND);
};
const getProductByQuyeryAPI = (current, pageSize, filters = {}) => {
  let URL_BACKEND = `/v1/api/user/product?page=${current}&limit=${pageSize}`;
  const {
    search,
    minPrice,
    maxPrice,
    rating,
    populate,
    sortBy,
    order,
    name,
    period,
    category,
    isFeatured,
  } = filters;
  if (search) URL_BACKEND += `&search=${encodeURIComponent(search)}`;
  if (minPrice) URL_BACKEND += `&minPrice=${minPrice}`;
  if (maxPrice) URL_BACKEND += `&maxPrice=${maxPrice}`;
  if (rating) URL_BACKEND += `&rating=${rating}`;
  if (populate) URL_BACKEND += `&populate=${populate}`;
  if (sortBy && order) URL_BACKEND += `&sortBy=${sortBy}&order=${order}`;
  if (name) URL_BACKEND += `&name=${name}`;
  if (period) URL_BACKEND += `&period=${period}`;

  if (category) URL_BACKEND += `&category=${category}`;
  if (isFeatured !== undefined) URL_BACKEND += `&isFeatured=${isFeatured}`;
  return axios.get(URL_BACKEND);
};
export {
  getAllProductAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  getProductByQuyeryAPI,
};
