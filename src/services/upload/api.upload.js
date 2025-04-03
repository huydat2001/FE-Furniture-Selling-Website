import axios from "../axios.customize";

const handleUploadFile = (file, folder) => {
  const URL_BACKEND = `/v1/api/upload`;

  let config = {
    headers: {
      folder: folder,
      "Content-type": "multipart/form-data",
    },
  };
  const bodyFormData = new FormData();
  bodyFormData.append("image", file);
  return axios.post(URL_BACKEND, bodyFormData, config);
};
export { handleUploadFile };
