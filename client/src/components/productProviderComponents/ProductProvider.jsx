import { useState } from "react";
import { filteredDataClient, mergeData } from "../../utils/arrayUtils";
import productAPI from "../../apis/productAPI";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Pagination from "./Pagination";
import { createContext } from "react";
import { useSearchParams } from "react-router-dom";
import Search from "./Search";

export const productPropsContext = createContext();

const ProductProvider = (props) => {
  const itemsPerPage = props.perPage;
  const defaultCussor = -1;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [cussor, setCussor] = useState(defaultCussor);
  const [saleOffProductList, setSaleOffProductList] = useState([]);
  const [saleOffTransactionList, setSaleOffTransactionList] = useState([]);
  const [cachedData, setCachedData] = useState([]); //all fetched data
  const [totalData, setTotalData] = useState([]); // data in total page
  const [currentData, setCurrentData] = useState([]); //data to render perpage

  //set query to send server
  const [searchParams, setSearchParams] = useSearchParams();
  const currentKiot = searchParams.get("kiotId");

  const [query, setQuery] = useState({
    search: "",
    price: "",
    category: "",
    fromdate: "",
    todate: "",
    Did: currentKiot ? currentKiot : "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    handleGetAllProduct(defaultCussor);
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(totalData.length / itemsPerPage));
    setCurrentData(
      totalData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [totalData, currentPage, itemsPerPage]);

  const handleDataFromServer = async (cussor) => {
    const res = await productAPI.getAllProduct_query(cussor, query);
    const data = res.data.data;

    const newLoadedData = mergeData(cachedData, data.productList);
    const newSaleOffProductList = mergeData(
      saleOffProductList,
      data.saleOffProductList
    );
    const newSaleOffTransactionList = mergeData(
      saleOffTransactionList,
      data.saleOffTransactionList
    );
    setTotalData(newLoadedData);
    setCachedData(newLoadedData);
    setSaleOffProductList(newSaleOffProductList);
    setSaleOffTransactionList(newSaleOffTransactionList);
    setCussor(data.cussor);
  };

  const handleGetAllProduct = async (cussor = defaultCussor) => {
    try {
      setIsLoading(true);
      await handleDataFromServer(cussor);
    } catch (error) {
      setError(`${error.response.data.messege}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setCurrentPage(1);
    let itemAfterClientSearch = filteredDataClient(cachedData, query);

    if (itemAfterClientSearch.length <= itemsPerPage) {
      try {
        setIsLoading(true);

        itemAfterClientSearch = filteredDataClient(cachedData, query);
        const res = await productAPI.getAllProduct_query(cussor, query);
        const data = res.data.data;

        const newQueryData = mergeData(itemAfterClientSearch, data.productList);
        const newSaleOffProductList = mergeData(
          saleOffProductList,
          data.saleOffProductList
        );
        const newSaleOffTransactionList = mergeData(
          saleOffTransactionList,
          data.saleOffTransactionList
        );

        setTotalData(newQueryData);
        setSaleOffProductList(newSaleOffProductList);
        setSaleOffTransactionList(newSaleOffTransactionList);
      } catch (error) {
        setError(
          `${error.response.data.messege}, ${error.response.data.error}`
        );
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    } else {
      try {
        setIsLoading(true);
        itemAfterClientSearch = await filteredDataClient(cachedData, query);

        setTotalData(itemAfterClientSearch);
        setCussor(itemAfterClientSearch.slice(-1)[0]._id - 1);
      } catch (error) {
        setError(
          `${error.response.data.messege}, ${error.response.data.error}`
        );
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  };

  const Props = {
    itemsPerPage,
    defaultCussor,
    setIsLoading,
    setError,
    totalPages,
    setTotalPages,
    currentPage,
    setCurrentPage,
    query,
    setQuery,
    totalData,
    cachedData,
    setCachedData,
    setTotalData,
    saleOffProductList,
    setSaleOffProductList,
    saleOffTransactionList,
    setSaleOffTransactionList,
    currentData,
    setCurrentData,
    cussor,
    setCussor,
    searchParams,
    setSearchParams,
    currentKiot,
    handleDataFromServer,
    handleGetAllProduct,
    handleSearch,
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <productPropsContext.Provider value={Props}>
      <div className="container-fluid">
        <Search {...Props} />
        <div className="container-fluid  product-container">
          <div className="container-fluid position-relative h-product-container p-0">
            {isLoading ? (
              <Load />
            ) : (
              <div className="container-fluid position-relative h-product-container p-0">
                {props.children}
                {totalPages ? <Pagination /> : ""}
              </div>
            )}
          </div>
          {props.rightSide}
        </div>
      </div>
    </productPropsContext.Provider>
  );
};

export const Load = () => {
  return (
    <div className="flex-grow-1 ">
      <div className="position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" variant="info" />;
      </div>
    </div>
  );
};

export const Error = ({ error }) => {
  return (
    <div className="flex-grow-1 h-product-container">
      <div className="position-absolute top-50 start-50 translate-middle text-danger">
        {error}
      </div>
    </div>
  );
};

export default ProductProvider;
