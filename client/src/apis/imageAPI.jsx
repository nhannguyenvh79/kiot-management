import axiosInstance from "./axiosInstance";

const imageAPI = {
    createImage: (values) => axiosInstance.post("/image/create", values),
};
export default imageAPI;
