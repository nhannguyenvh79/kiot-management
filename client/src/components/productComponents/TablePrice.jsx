import React, { useContext, useEffect, useState } from "react";
import cartContext from "../../contexts/CartContext/CartContext";
import {
  caculatePromotionPrice,
  caculateTotalPrice,
} from "../../utils/cartUtils";
import { AiFillCloseCircle } from "react-icons/ai";
import { PiShoppingCartSimpleDuotone } from "react-icons/pi";
const TablePrice = () => {
  const { cart, changeQuantity } = useContext(cartContext);
  const [arrQuantity, setArrQuantity] = useState([]);

  const handleOnChange = (value, index) => {
    if (parseInt(value) >= 0 || value === "") {
      const updateQuantity = [...arrQuantity];
      updateQuantity[index] = value;
      setArrQuantity(updateQuantity);
    }
  };

  useEffect(() => {
    setArrQuantity(cart.map((el) => el.quantity));
  }, [cart]);

  return (
    <div className="table m-0 ">
      <div className="border-bottom" style={{ position: "sticky", top: "0" }}>
        <div className="grid-table-price">
          <div className="product-grid grid-head-color">
            <strong>Product</strong>
          </div>
          <div className="quantity-grid grid-head-color">
            <strong>Quantity</strong>
          </div>
          <div className="total-grid grid-head-color">
            <strong>Total</strong>
          </div>
          <div className="action-grid grid-head-color">
            <strong>Action</strong>
          </div>
        </div>
      </div>

      <div>
        {!cart.length ? (
          <div className="position-absolute top-50 start-50 translate-middle">
            <h6 className="text-center text-info-color p-0">
              <PiShoppingCartSimpleDuotone fontSize={45} />
            </h6>

            <h6 className="text-center text-info-color p-0">
              Please choose product
            </h6>
          </div>
        ) : (
          cart.map((el, index) => {
            return (
              <div
                className="grid-table-price border-bottom"
                key={el.product._id}
              >
                <div className="product-grid">
                  <div className="d-flex flex-column">
                    <img src={el.product.image} alt={el.product.name_product} />
                    <div className="d-inline-block align-middle mb-0">
                      <div className="d-inline-block align-middle mb-0 grid-text">
                        {el.product.name_product}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quantity-grid">
                  <input
                    className="form-control w-75"
                    type="number"
                    value={arrQuantity[index]}
                    onChange={(e) => handleOnChange(e.target.value, index)}
                    onBlur={(e) => {
                      changeQuantity(el.product, arrQuantity[index]);
                    }}
                  />
                  <div className="text-muted font-13">
                    x ${caculatePromotionPrice(el.product.price, el.saleOff)}
                  </div>
                </div>

                <div className="total-grid grid-text">
                  $
                  {caculateTotalPrice(
                    caculatePromotionPrice(el.product.price, el.saleOff),
                    el.quantity
                  )}
                </div>

                <div className="action-grid">
                  <button onClick={() => changeQuantity(el.product, 0)}>
                    <AiFillCloseCircle />
                  </button>
                </div>
              </div>
            );
          })
        )}
        {}
      </div>
    </div>
  );
};

export default TablePrice;
