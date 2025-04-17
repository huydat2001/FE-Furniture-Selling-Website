import axios from "axios";

const CreateQRCodeAPI = (data) => {
  const datafinal = {
    accountNo: 102873114863,
    accountName: "NGUYEN HUY DAT",
    acqId: 970415,
    amount: data.total,
    addInfo: data.message,
    format: "text",
    template: "compact2",
  };
  const URL_VietQR = import.meta.env.VITE_VietQR_URL;
  const xClientID = import.meta.env.VITE_X_Client_ID;
  const xAPIKey = import.meta.env.VITE_X_API_Key;
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": xClientID,
      "x-api-key": xAPIKey,
    },
  };

  return axios.post(URL_VietQR, datafinal, config);
};
export { CreateQRCodeAPI };
