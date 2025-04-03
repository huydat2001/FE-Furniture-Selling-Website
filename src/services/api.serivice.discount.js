import axios from "./axios.customize";
const getAllDiscountAPI = (current, pageSize) => {
  let URL_BACKEND = "";
  if ((current, pageSize)) {
    URL_BACKEND = `/v1/api/discount?page=${current}&limit=${pageSize}`;
  }
  URL_BACKEND = `/v1/api/discount`;
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
