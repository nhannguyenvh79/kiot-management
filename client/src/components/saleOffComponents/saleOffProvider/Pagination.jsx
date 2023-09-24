import React, { useContext } from "react";
import ReactPaginate from "react-paginate";
import { mergeData } from "../../../utils/arrayUtils";
import { saleOffContext } from "./SaleOffProvider";
import saleOffAPI from "../../../apis/saleOffAPI";

const Pagination = (props) => {
  const saleOffProps = useContext(saleOffContext);
  const {
    type,
    setError,
    totalPages,
    setCurrentPage,
    currentPage,
    query,
    totalData,
    setTotalData,
    cussor,
    setCussor,
    setIsLoading,
    handleDataFromServer,
  } = saleOffProps;

  const handlePageClick = async (e) => {
    const newCurrentPage = e.selected + 1;

    setCurrentPage(newCurrentPage);
    //when client access to the  last page, load more 50 items
    const isQuerying = Boolean(
      query.search ||
        query.rate ||
        query.active ||
        query.fromdate ||
        query.todate
    );

    try {
      setIsLoading(true);

      if (newCurrentPage >= totalPages && !isQuerying) {
        await handleDataFromServer(cussor);
      } else if (newCurrentPage >= totalPages && isQuerying) {
        const res = await saleOffAPI.getAllSaleoff_query(cussor, query);

        const data = res.data.data;
        let newQueryData = [];

        if (type === 1) {
          newQueryData = mergeData(totalData, data.saleOffProductList);
        } else if (type === 2) {
          newQueryData = mergeData(totalData, data.saleOffTransactionList);
        }

        setTotalData(newQueryData);
        setCussor(data.cussor);
      }
    } catch (error) {
      setError(`${error.response.data.messege}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=" >"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={totalPages}
      previousLabel="< "
      renderOnZeroPageCount={null}
      forcePage={currentPage - 1}
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      marginPagesDisplayed={1}
      containerClassName="pagination"
      activeClassName="active"
    />
  );
};

export default Pagination;
