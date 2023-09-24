import axiosInstance from "./axiosInstance";

const kiotAPI = {
    getAll: () => axiosInstance.get("/kiot"),
    getById: (kiot_id) => axiosInstance.get(`/kiot/getById?Did=${kiot_id}`),
    update: (kiot) => axiosInstance.post("/kiot/update",kiot),
};

export default kiotAPI;
