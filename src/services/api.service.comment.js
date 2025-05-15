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
  return axios.post("/v1/api/comments", data, config);
};
export { getCommentsByProduct, createComment };
