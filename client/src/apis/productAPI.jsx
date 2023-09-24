import axiosInstance from "./axiosInstance";

const productAPI = {
  getAllProduct: (cussor, query) =>
    axiosInstance.get(`/product?cussor=${cussor}&Did=${query.Did}`),
  getAllProduct_query: (cussor, query) =>
    axiosInstance.get(
      `/product/query?cussor=${cussor}&search=${query.search}&price=${query.price}&category=${query.category}&fromdate=${query.fromdate}&todate=${query.todate}&Did=${query.Did}`
    ),
  createProduct: (values) => axiosInstance.post("/product/create", values),
  updateProduct: (values) => axiosInstance.post("/product/update", values),
  getByIdProduct: () => {},
};
export default productAPI;
