import React, { useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { logo } from "../header/Header";
import { useState } from "react";
import cartContext from "../../contexts/CartContext/CartContext";
import { useContext } from "react";
import {
  caculateTotalPaymentAfterTax,
  caculateTotalPaymentWithSaleOff,
} from "../../utils/cartUtils";
import Method from "./paymentMethods/Method";
import saleOffAPI from "../../apis/saleOffAPI";
import AuthContext from "../../contexts/AuthContext/AuthContext";

const methods = [
  {
    name: "cash",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSN5dqGLMGrvnqiCzjMjXbUoJEw6puzvmstx8INpufFKL50vYwl6XJR7EI-_gYmd4rPr4&usqp=CAU",
  },
  {
    name: "visa",
    img: "https://emspay.nl/sites/emspay.nl/files/images/Payment%20methods/Visa_Brandmark_Blue_RGB.png",
  },
  {
    name: "momo",
    img: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
  },
  {
    name: "banking",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBMll5NT7RYRjdEoD2-4AWDQowYyaWei3SOYjqNi_szHtu8IlC0j5PJn8Dk7ZBw8sRLxo&usqp=CAU",
  },
];

const PaymentModal = (props) => {
  const { cart, isPaid, setIsPaid, clearCart } = useContext(cartContext);
  const { auth } = useContext(AuthContext);
  const [method, setMethod] = useState("cash");

  const [code, setCode] = useState("");
  const [price, setPrice] = useState(0);
  const [validCode, setValidCode] = useState(true);
  const [checkingCode, setCheckingCode] = useState(false);

  const [totalPayment, setTotalPayment] = useState(
    caculateTotalPaymentAfterTax(cart)
  );

  useEffect(() => {
    const handleSaleoff = setTimeout(() => {
      getSaleoff();
    }, 1000);
    return () => clearTimeout(handleSaleoff);
  }, [code]);

  useEffect(() => {
    setTotalPayment(caculateTotalPaymentAfterTax(cart));
  }, [cart]);

  const getSaleoff = async () => {
    try {
      setCheckingCode(true);
      const res = await saleOffAPI.getByIdSaleoff(code || -1);
      const saleOff = res.data.data.saleOffInfo;

      if (
        saleOff &&
        saleOff.type === 2 &&
        saleOff.active &&
        saleOff.kiot_id === auth.user.kiot_id
      ) {
        setValidCode(true);
        const newTotalPayment = caculateTotalPaymentWithSaleOff(
          cart,
          saleOff.price
        );
        setPrice(saleOff.price);
        setTotalPayment(newTotalPayment.toFixed(1));
      } else {
        setValidCode(false);
        setTotalPayment(caculateTotalPaymentAfterTax(cart));
        setPrice(0);
      }

      if (code === "") {
        setValidCode(true);
        setTotalPayment(caculateTotalPaymentAfterTax(cart));
        setPrice(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCheckingCode(false);
    }
  };

  const chooseMethod = (name) => {
    setMethod(name);
  };

  const handleCLoseModal = () => {
    if (isPaid) {
      clearCart();
      setIsPaid(false);
      props.onHide();
      setCode("");
    } else {
      props.onHide();
      setCode("");
    }
  };

  const childProps = {
    validCode,
    price,
    totalPayment,
  };

  return (
    <Modal
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="payment-modal"
      dialogClassName="payment-dialog"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <div className="logo">
            <span>
              <img src={logo} alt="logo-small" className="logo-sm" />
            </span>
            <span>
              <div className="logo-lg">Payment </div>
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="payment-center-container">
        <div className="payment-method-container">
          <h5>Payment method</h5>
          <div className="payment-methods">
            {methods.map((el) => {
              return (
                <div
                  className={`payment-img ${
                    el.name === method ? "active" : ""
                  }`}
                  key={el.name}
                  onClick={() => chooseMethod(el.name)}
                >
                  <img alt={el.name} src={el.img} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="payment-infor-container">
          <h5>Order summary</h5>

          <table className="table">
            <tbody>
              <tr>
                <td className="payment-title">Subtotal:</td>
                <td className="text-dark">
                  <strong>${caculateTotalPaymentAfterTax(cart)}</strong>
                  <span className="text-success ms-2">-{price}%</span>
                </td>
                <td className="payment-title"></td>
                <td className="payment-title"></td>
              </tr>

              <tr>
                <td className="payment-title">Code:</td>
                <td className="text-dark position-relative">
                  <div
                    className="position-relative"
                    style={{ width: "fit-content" }}
                  >
                    <input
                      type="text"
                      placeholder="Enter discount code.."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />

                    {checkingCode && (
                      <Spinner
                        className="m-1 position-absolute end-0"
                        animation="border"
                        variant="info"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}

                    {!validCode && (
                      <p
                        className="text-danger position-absolute end-0 top-50"
                        style={{
                          transform: "translate(110%,-50%)",
                        }}
                      >
                        Code is not valid
                      </p>
                    )}
                  </div>
                </td>
                <td className="payment-title"></td>
                <td className="payment-title"></td>
              </tr>

              <tr>
                <td className="payment-title">Total payment:</td>
                <td className="text-dark">
                  {cart.length && <strong>${totalPayment}</strong>}
                </td>
                <td className="payment-title"></td>
                <td className="payment-title"></td>
              </tr>
            </tbody>
          </table>

          <Method name={method} {...childProps} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleCLoseModal}
          style={{ backgroundColor: "gray", color: "white", border: "none" }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
