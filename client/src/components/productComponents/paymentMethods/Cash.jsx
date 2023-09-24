import React from "react";
import cartContext from "../../../contexts/CartContext/CartContext";
import { useContext } from "react";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import AuthContext from "../../../contexts/AuthContext/AuthContext";
import { handleFormatCart } from "../../../utils/cartUtils";

const Cash = (props) => {
  const { validCode, price, totalPayment } = props;
  const { cart, isPaid, setIsPaid, creatTransaction, updateTransaction } =
    useContext(cartContext);
  const { auth } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [paid, setPaid] = useState(0);

  const caculateChange = (paid) => {
    if (paid === "" || paid < 0) return 0;

    const newChange = (parseFloat(paid) - parseFloat(totalPayment)).toFixed(1);
    if (newChange < 0 || !newChange) return 0;
    if (newChange >= 0) return newChange;
  };

  const Status = (paid) => {
    if (parseFloat(paid) >= parseFloat(totalPayment)) return true;
    return false;
  };

  const handlePayMent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dataCreate = {
        username: auth.user.username || "admin",
        kiot_id: auth.user.kiot_id || "-1",
        deposit: "",
        returnV: "",
        retrun_list: [],
        product_list: handleFormatCart(cart) || [],
        value: totalPayment || 0,
        method: "cash",
        paid_value: paid,
        saleoff: validCode || false,
        saleoff_rate: price,
      };
      const res = await creatTransaction(dataCreate);

      const transactiontInfo = res.data.data.transactiontInfo;
      const dataUpdate = {
        ...transactiontInfo,
        transactionId: transactiontInfo._id,
      };
      await updateTransaction(dataUpdate);

      setIsPaid(true);
    } catch (error) {
      setError(error.response.data.messege);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-5 position-relative">
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spinner animation="border" variant="info" />;
        </div>
      </div>
    );
  }
  if (isPaid) {
    return (
      <div className="mt-5 position-relative">
        <div className="position-absolute top-50 start-50 translate-middle">
          <p className="text-success">Payment successfull!</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-5 position-relative">
        <div className="position-absolute top-50 start-50 translate-middle">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 position-relative">
      <h5>Cash</h5>
      <table className="table">
        <tbody>
          <tr>
            <td className="payment-title">Paid:</td>
            <td className="text-dark">
              <input
                type="number"
                placeholder="Enter paid money.."
                value={paid}
                onChange={(e) => e.target.value >= 0 && setPaid(e.target.value)}
              />
            </td>
            <td className="payment-title"></td>
            <td className="payment-title"></td>
          </tr>

          <tr>
            <td className="payment-title">Change:</td>
            <td className="text-dark">
              <strong>${caculateChange(paid)}</strong>
            </td>
            <td className="payment-title"></td>
            <td className="payment-title"></td>
          </tr>

          <tr>
            <td className="payment-title">Status:</td>
            <td className="text-dark">
              {Status(paid) ? (
                <span className="text-success">Done</span>
              ) : (
                <span className="text-danger">Not completed</span>
              )}
            </td>
            <td className="payment-title"></td>
            <td className="payment-title"></td>
          </tr>
        </tbody>
      </table>
      <div className="w-100 d-flex justify-content-end">
        <Button
          onClick={handlePayMent}
          className="end-0"
          style={Status(paid) ? { opacity: 1 } : { opacity: 0 }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Cash;
