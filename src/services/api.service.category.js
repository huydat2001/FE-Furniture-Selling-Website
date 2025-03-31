import axios from "./axios.customize";
const getAllCategoryAPI = (current, pageSize) => {
  let URL_BACKEND = "";
  if ((current, pageSize)) {
    URL_BACKEND = `/v1/api/category?page=${current}&limit=${pageSize}`;
  }
  URL_BACKEND = `/v1/api/category`;
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
