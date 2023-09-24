import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AddProductModal from "./AddProductModal";
import TableList from "./TableList";
import { productPropsContext } from "../productProviderComponents/ProductProvider";
import { EmptyProduct } from "../productComponents/ProductRender";

const ProductListRender = () => {
  const productProps = useContext(productPropsContext);

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (productProps.currentData.length > 0 || !productProps.isLoading) {
      setDataLoaded(true);
    }
  }, [productProps.currentData, productProps.isLoading]);

  return (
    <div>
      <AddProductModal />
      {dataLoaded && !productProps.currentData.length ? (
        <EmptyProduct />
      ) : (
        <TableList data={productProps.currentData} />
      )}
    </div>
  );
};

export default ProductListRender;
