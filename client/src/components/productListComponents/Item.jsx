import React from "react";
import EditProductModal from "./EditProductModal";
import { useContext } from "react";
import { productPropsContext } from "../productProviderComponents/ProductProvider";

const Item = (props) => {
  const product = props.product;

  const productProps = useContext(productPropsContext);
  const saleOffProductList = productProps.saleOffProductList;

  const getSaleOffProduct = (product) => {
    const saleOffProduct = saleOffProductList.find(
      (el) =>
        el.name_product === product.name_product &&
        el.kiot_id === product.kiot_id
    );
    return saleOffProduct;
  };
  return (
    <tr>
      <td>{product.name_product}</td>
      <td>{product.category}</td>
      <td>${product.price}</td>
      <td>
        {getSaleOffProduct(product) && getSaleOffProduct(product).active ? (
          <p className="text-success m-0"> Yes</p>
        ) : (
          <p className="text-danger m-0">No</p>
        )}
      </td>
      <td>
        {product.active ? (
          <p className="text-success m-0"> Yes</p>
        ) : (
          <p className="text-danger m-0">No</p>
        )}
      </td>
      <td>
        <EditProductModal product={product} />
      </td>
    </tr>
  );
};

export default Item;
