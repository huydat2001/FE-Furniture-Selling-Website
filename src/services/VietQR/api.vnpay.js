import axios from "../axios.customize";

const CreateVNPAYAPI = (data) => {
  const URL_VNPAY = "/v1/api/create_payment_url";
  return axios.post(URL_VNPAY, data);
};
const ReturnVNPAYAPI = (queryParams) => {
  const URL_VNPAY = `/v1/api/vnpay_return${
    queryParams ? `?${queryParams}` : ""
  }`;
  return axios.get(URL_VNPAY);
};
export { CreateVNPAYAPI, ReturnVNPAYAPI };
