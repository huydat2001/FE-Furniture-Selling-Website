import axios from "./axios.customize";
const getCommentsByProduct = (current, pageSize, productId) => {
  const params = new URLSearchParams();
  if (current && pageSize) {
    params.append("page", current);
    params.append("limit", pageSize);
  }
  if (productId) {
    params.append("productId", productId);
  }

  const URL_BACKEND = `/v1/api/comments?${params.toString()}`;
  return axios.get(URL_BACKEND);
};
const createComment = (data, config) => {
  const URL_BACKEND = `/v1/api/comments`;
  return axios.post(URL_BACKEND, data, config);
};
const deleteComment = (productId) => {
  const URL_BACKEND = `/v1/api/comments/${productId}`;
  return axios.delete(URL_BACKEND);
};
export { getCommentsByProduct, createComment, deleteComment };
