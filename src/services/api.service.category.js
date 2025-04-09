import axios from "./axios.customize";
const getAllCategoryAPI = (current, pageSize, filter = {}) => {
  let params = new URLSearchParams();

  // Thêm phân trang
  if (current && pageSize) {
    params.append("page", current);
    params.append("limit", pageSize);
  }

  // Thêm filter
  if (filter.status) {
    params.append("status", filter.status);
  }
  let URL_BACKEND = `/v1/api/category?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
const createCategoryAPI = (value) => {
  const URL_BACKEND = "/v1/api/category";
  return axios.post(URL_BACKEND, value);
};
const updateCategoryAPI = (value) => {
  const URL_BACKEND = "/v1/api/category";
  return axios.put(URL_BACKEND, value);
};
const deleteCategoryAPI = (id) => {
  const URL_BACKEND = `/v1/api/category/${id}`;
  return axios.delete(URL_BACKEND);
};
export {
  getAllCategoryAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
};
