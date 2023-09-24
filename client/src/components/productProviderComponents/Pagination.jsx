import React, { useContext } from "react";
import ReactPaginate from "react-paginate";
import productAPI from "../../apis/productAPI";
import { mergeData } from "../../utils/arrayUtils";
import { productPropsContext } from "./ProductProvider";

const Pagination = (props) => {
  const productProps = useContext(productPropsContext);
  const {
    totalData,
    setTotalData,
    cussor,
    setCussor,
    query,
    totalPages,
    currentPage,
    setCurrentPage,
    handleDataFromServer,
    setError,
    saleOffProductList,
    setSaleOffProductList,
    saleOffTransactionList,
    setSaleOffTransactionList,
    setIsLoading,
  } = productProps;

  const handlePageClick = async (e) => {
    const newCurrentPage = e.selected + 1;

    setCurrentPage(newCurrentPage);
    //when client access to the  last page, load more 50 items
    const isQuerying = Boolean(
      query.search ||
        query.price ||
        query.category ||
        query.fromdate ||
        query.todate
    );

    try {
      setIsLoading(true);

      if (newCurrentPage >= totalPages && !isQuerying) {
        await handleDataFromServer(cussor);
      } else if (newCurrentPage >= totalPages && isQuerying) {
        const res = await productAPI.getAllProduct_query(cussor, query);

        const data = res.data.data;

        const newQueryData = mergeData(totalData, data.productList);
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
