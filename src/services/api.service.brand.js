import axios from "./axios.customize";
const getAllBrandAPI = (current, pageSize, filter = {}) => {
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
  let URL_BACKEND = `/v1/api/brand?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
const createBrandAPI = (value) => {
  const URL_BACKEND = "/v1/api/brand";
  return axios.post(URL_BACKEND, value);
};
const updateBrandAPI = (value) => {
  const URL_BACKEND = "/v1/api/brand";
  return axios.put(URL_BACKEND, value);
};
const deleteBrandAPI = (id) => {
  const URL_BACKEND = `/v1/api/brand/${id}`;
  return axios.delete(URL_BACKEND);
};
export { getAllBrandAPI, createBrandAPI, updateBrandAPI, deleteBrandAPI };
