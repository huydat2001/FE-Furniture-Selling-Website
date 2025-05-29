import axios from "./axios.customize";
const getAllUserAPI = (current, pageSize) => {
  const URL_BACKEND = `/v1/api/user?page=${current}&limit=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const createUserAPI = (value) => {
  const URL_BACKEND = "/v1/api/user";

  const data = {
    username: value.username,
    email: value.email,
    password: value.password,
    fullName: value.fullName,
    role: value.role,
    phone: value.phone,
    status: value.status,
    city: value.address?.[0] ?? undefined,
    state: value.address?.[1] ?? undefined,
    street: value.address?.[2] ?? undefined,
  };
  return axios.post(URL_BACKEND, data);
};
const updateUserAPI = (value) => {
  const URL_BACKEND = "/v1/api/user";
  console.log("value :>> ", value);
  const data = {
    id: value.id,
    password: value.password, // Mật khẩu mới
    fullName: value.fullName,
    role: value.role,
    phone: value.phone,
    city: value.city ?? undefined,
    state: value.state ?? undefined,
    street: value.street ?? undefined,
    country: value.country ?? undefined,
    currentPassword: value.currentPassword, // Thêm mật khẩu hiện tại
  };
  return axios.put(URL_BACKEND, data);
};
const deleteUserAPI = (id) => {
  const URL_BACKEND = `/v1/api/user/${id}`;
  return axios.delete(URL_BACKEND);
};
const changePasswordAPI = (value) => {
  const URL_BACKEND = "/v1/api/user/change-password";
  const data = {
    id: value.id,
    currentPassword: value.currentPassword,
    newPassword: value.newPassword,
  };
  return axios.put(URL_BACKEND, data);
};
export {
  getAllUserAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
  changePasswordAPI,
};
