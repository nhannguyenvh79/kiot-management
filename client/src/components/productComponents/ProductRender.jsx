import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ImFilesEmpty } from "react-icons/im";
import { productPropsContext } from "../productProviderComponents/ProductProvider";
import ProductCart from "./ProductCart";

const ProductRender = () => {
  const productProps = useContext(productPropsContext);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (productProps.currentData.length > 0 || !productProps.isLoading) {
      setDataLoaded(true);
    }
  }, [productProps.currentData, productProps.isLoading]);

  const noProductCheck = (productList) => {
    let isNo = true;
    if (!productList.length) {
      isNo = true;
    }
    productList?.forEach((el) => {
      if (el.active === true) {
        isNo = false;
        return;
      }
    });
    return isNo;
  };

  if (dataLoaded && noProductCheck(productProps.currentData)) {
    return <EmptyProduct />;
  }

  return (
    <div
      className="grid-product h-product-container over-flow-scroll scrollbar-small "
      style={
        productProps.currentData.length < 4
          ? { justifyContent: "start" }
          : { ustifyContent: "space-between" }
      }
    >
      {productProps.currentData.map((item) => {
        if (item.active === true) {
          return <ProductCart product={item} key={item._id} />;
        }
      })}
    </div>
  );
};

export const EmptyProduct = () => {
  return (
    <div className="w-100 rounded h-product-container position-relative bg-white">
      <div className="position-absolute top-50 start-50 translate-middle text-danger">
        <p className="text-center text-info-color p-0">
          <ImFilesEmpty fontSize={45} />
        </p>

        <h6 className="text-center text-info-color p-0">
          There are no products!
        </h6>
      </div>
    </div>
  );
};

export default ProductRender;
