import axios from "./axios.customize";
const getAllDiscountAPI = (current, pageSize, filter = {}) => {
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
  let URL_BACKEND = `/v1/api/discount?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
const createDiscountAPI = (value) => {
  const URL_BACKEND = "/v1/api/discount";
  return axios.post(URL_BACKEND, value);
};
const updateDiscountAPI = (value) => {
  const URL_BACKEND = "/v1/api/discount";
  return axios.put(URL_BACKEND, value);
};
const deleteDiscountAPI = (id) => {
  const URL_BACKEND = `/v1/api/discount/${id}`;
  return axios.delete(URL_BACKEND);
};
export {
  getAllDiscountAPI,
  createDiscountAPI,
  updateDiscountAPI,
  deleteDiscountAPI,
};
