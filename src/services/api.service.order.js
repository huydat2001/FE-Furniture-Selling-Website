import axios from "./axios.customize";
const getAllOrderAPI = (current, pageSize, filter = {}) => {
  let params = new URLSearchParams();
  if (current && pageSize) {
    params.append("page", current);
    params.append("limit", pageSize);
  }
  // Thêm filter
  if (filter.status) {
    params.append("status", filter.status);
  }
  if (filter.sortBy) {
    params.append("sortBy", filter.sortBy);
  }
  if (filter.order) {
    params.append("order", filter.order);
  }
  if (filter.period) {
    params.append("period", filter.period);
  }
  let URL_BACKEND = `/v1/api/order?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
const createOrderAPI = (value) => {
  const URL_BACKEND = "/v1/api/order";
  return axios.post(URL_BACKEND, value);
};
const updateOrderAPI = (value) => {
  const URL_BACKEND = "/v1/api/order";
  return axios.put(URL_BACKEND, value);
};
const deleteOrderAPI = (id) => {
  const URL_BACKEND = `/v1/api/order/${id}`;
  return axios.delete(URL_BACKEND);
};
const cancelOrderAPI = async (orderId) => {
  return await axios.post(`/api/order/cancel`, { orderId });
};
export {
  getAllOrderAPI,
  createOrderAPI,
  updateOrderAPI,
  deleteOrderAPI,
  cancelOrderAPI,
};
