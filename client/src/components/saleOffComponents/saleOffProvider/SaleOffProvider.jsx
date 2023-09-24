import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Pagination from "./Pagination";
import { createContext } from "react";
import { useSearchParams } from "react-router-dom";
import saleOffAPI from "../../../apis/saleOffAPI";
import { filteredSaleOffClient, mergeData } from "../../../utils/arrayUtils";
import Search from "./Search";

export const saleOffContext = createContext();

const SaleOffProvider = (props) => {
  const { type, children, perPage } = props;
  const itemsPerPage = perPage;
  const defaultCussor = -1;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [cussor, setCussor] = useState(defaultCussor);
  const [cachedData, setCachedData] = useState([]); //all fetched data
  const [totalData, setTotalData] = useState([]); // data in total page
  const [currentData, setCurrentData] = useState([]); //data to render perpage

  //set query to send server
  const [searchParams, setSearchParams] = useSearchParams();
  const currentKiot = searchParams.get("kiotId");

  const [query, setQuery] = useState({
    search: "",
    rate: "",
    active: "",
    fromdate: "",
    todate: "",
    Did: currentKiot ? currentKiot : "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    handleGetAllSaleoff(defaultCussor);
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
    const res = await saleOffAPI.getAllSaleoff(cussor, query);
    const data = res.data.data;

    let newLoadedData = [];
    if (type === 1) {
      newLoadedData = mergeData(cachedData, data.saleOffProductList, true);
    } else if (type === 2) {
      newLoadedData = mergeData(cachedData, data.saleOffTransactionList, true);
    }

    setTotalData(newLoadedData);
    setCachedData(newLoadedData);
    setCussor(data.cussor);
  };

  const handleGetAllSaleoff = async (cussor = defaultCussor) => {
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
    let itemAfterClientSearch = filteredSaleOffClient(cachedData, query);

    if (itemAfterClientSearch.length <= itemsPerPage) {
      try {
        setIsLoading(true);

        itemAfterClientSearch = filteredSaleOffClient(cachedData, query);
        const res = await saleOffAPI.getAllSaleoff_query(cussor, query);
        const data = res.data.data;

        let newQueryData = [];

        if (type === 1) {
          newQueryData = mergeData(
            itemAfterClientSearch,
            data.saleOffProductList
          );
        } else if (type === 2) {
          newQueryData = mergeData(
            itemAfterClientSearch,
            data.saleOffTransactionList
          );
        }

        setTotalData(newQueryData);
      } catch (error) {
        setError(
          `${error.response.data.messege}, ${error.response.data.error}`
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        itemAfterClientSearch = await filteredSaleOffClient(cachedData, query);
        setTotalData(itemAfterClientSearch);
        setCussor(itemAfterClientSearch.slice(-1)[0]._id - 1);
      } catch (error) {
        setError(`${error.response.data.messege}`);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  };

  const Props = {
    type,
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
    setTotalData,
    cachedData,
    setCachedData,
    currentData,
    setCurrentData,
    cussor,
    setCussor,
    searchParams,
    setSearchParams,
    currentKiot,
    handleDataFromServer,
    handleGetAllSaleoff,
    handleSearch,
  };

  if (isLoading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" variant="info" />;
      </div>
    );
  }

  if (error) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="w-100">
      <div className="row p-2">
        <saleOffContext.Provider value={Props}>
          <div className="my-2">
            <Search {...Props} />
          </div>
          {children}
          {totalPages ? <Pagination /> : ""}
        </saleOffContext.Provider>
      </div>
    </div>
  );
};

export default SaleOffProvider;
