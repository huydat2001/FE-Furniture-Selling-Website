import axios from "./axios.customize";
const getAllBrandAPI = (current, pageSize) => {
  let URL_BACKEND = "";
  if ((current, pageSize)) {
    URL_BACKEND = `/v1/api/brand?page=${current}&limit=${pageSize}`;
  }
  URL_BACKEND = `/v1/api/brand`;
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
