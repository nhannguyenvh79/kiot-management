import React, { useContext } from "react";
import cartContext from "../../contexts/CartContext/CartContext";
import {
  caculateTax,
  caculateTotalPayment,
  caculateTotalPaymentAfterTax,
} from "../../utils/cartUtils";

const TablePayment = () => {
  const { cart } = useContext(cartContext);

  return (
    <div className="d-flex">
      <table className="table">
        <tbody>
          <tr>
            <td className="payment-title">Order Total:</td>
            <td>
              {cart.length && (
                <span className="text-dark">${caculateTotalPayment(cart)}</span>
              )}
            </td>
            <td className="payment-title">Tax:</td>
            <td>
              {cart.length && (
                <span className="text-dark">${caculateTax(cart)}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="payment-title">Subtotal</td>
            <td>
              {cart.length && (
                <strong className="text-dark">
                  ${caculateTotalPaymentAfterTax(cart)}
                </strong>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablePayment;
