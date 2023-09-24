import React, { useContext } from "react";
import Star from "./Star";
import cartContext from "../../contexts/CartContext/CartContext";
import { caculatePromotionPrice } from "../../utils/cartUtils";
import { productPropsContext } from "../productProviderComponents/ProductProvider";

const ProductCart = ({ product }) => {
  const { addProduct, cart } = useContext(cartContext);
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

  const handleChoosingProduct = (_id) => {
    const choosingProduct = cart.find((el) => el.product._id === _id);
    if (choosingProduct) {
      return "chose-product";
    } else {
      return "";
    }
  };

  return (
    <div
      className={`card e-co-product w-cart ${handleChoosingProduct(
        product._id
      )} `}
      onClick={() =>
        addProduct(
          product,
          getSaleOffProduct(product) && getSaleOffProduct(product).price
        )
      }
    >
      <div className="img-cart-container">
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid img-cart"
        />
      </div>

      {getSaleOffProduct(product) && getSaleOffProduct(product).active && (
        <div className="ribbon ribbon-pink">
          <span>{getSaleOffProduct(product).price}% OFF</span>
        </div>
      )}
      <div className="card-body product-info">
        <div className="w-100 d-flex justify-content-start">
          <div className="product-title">{product.name_product}</div>
        </div>

        <div className="d-flex flex-column justify-content-between my-2">
          {getSaleOffProduct(product) && getSaleOffProduct(product).active ? (
            <p className="product-price">
              $
              {caculatePromotionPrice(
                product.price,
                getSaleOffProduct(product).price
              )}
              <span className="ml-2">
                {"   "}
                <del>${product.price}</del>
              </span>
            </p>
          ) : (
            <p className="product-price">${product.price}</p>
          )}

          <ul className="list-inline mb-0 product-review">
            <Star customer_rate={product.customer_rate} />
          </ul>
        </div>
        <div className="category px-3 rounded mb-2 bg-primary text-white waves-effect waves-light">
          {product.category}
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
