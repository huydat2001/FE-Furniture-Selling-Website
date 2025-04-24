import axios from "./axios.customize";

const getCartAPI = () => {
  const URL_BACKEND = "/v1/api/cart";
  return axios.get(URL_BACKEND);
};

const addToCartAPI = (cartItem) => {
  const URL_BACKEND = "/v1/api/cart/add";
  return axios.post(URL_BACKEND, cartItem);
};

const updateCartAPI = (productId, quantity) => {
  const URL_BACKEND = "/v1/api/cart/update";
  return axios.put(URL_BACKEND, {
    productId,
    quantity,
  });
};

const removeFromCartAPI = async (productId) => {
  const URL_BACKEND = "/v1/api/cart/remove";
  return axios.delete(`${URL_BACKEND}/${productId}`);
};
const clearCartAPI = (data) => {
  const URL_BACKEND = "/v1/api/cart/";
  return axios.delete(URL_BACKEND, data);
};
export {
  getCartAPI,
  addToCartAPI,
  updateCartAPI,
  removeFromCartAPI,
  clearCartAPI,
};
