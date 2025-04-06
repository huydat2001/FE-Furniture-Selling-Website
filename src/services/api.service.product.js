import axios from "./axios.customize";
const getAllProductAPI = (current, pageSize) => {
  let URL_BACKEND = "";
  if ((current, pageSize)) {
    URL_BACKEND = `/v1/api/product?page=${current}&limit=${pageSize}`;
  }
  URL_BACKEND = `/v1/api/product`;
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
export {
  getAllProductAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
};
