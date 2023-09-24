import React, { useContext, useEffect, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import transactionAPI from "../../apis/transaction";
import AuthContext from "../../contexts/AuthContext/AuthContext";
import { FaTrash } from "react-icons/fa6";

const TransactionModal = ({
  show,
  handleClose,
  onUpdateTransaction,
  editedTransaction,
}) => {
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);
  const { user } = auth;

  const [productList, setProductList] = useState([]);
  useEffect(() => {
    editedTransaction &&
      setProductList(
        editedTransaction.product_list.map((product) => {
          return { ...product, isReturned: false };
        })
      );
  }, [editedTransaction]);

  const [returnedList, setReturnedList] = useState([]);

  const handleReturnedItem = (item, index) => {
    if (!item.isReturned) {
      setReturnedList((currentList) => [...currentList, item]);
      setProductList((currentProductList) => {
        return currentProductList.map((product, idx) => {
          return index === idx ? { ...product, isReturned: true } : product;
        });
      });
    } else {
      setReturnedList((currentList) =>
        currentList.filter((i) => i._id !== item._id)
      );
      setProductList((currentProductList) => {
        return currentProductList.map((product, idx) => {
          return index === idx ? { ...product, isReturned: false } : product;
        });
      });
    }
  };

  const handleEditTransaction = () => {
    createReturnedTransaction();
  };

  const returnedValue = returnedList.reduce((accumulator, item) => {
    return accumulator + item.value;
  }, 0);

  async function createReturnedTransaction() {
    const newTransaction = {
      username: user.username,
      kiot_id: editedTransaction.kiot_id,
      status: 2,
      // deposit: 0,
      returnV: returnedValue,
      retrun_list: returnedList,
      // product_list: [],
    };
    setLoading(true);
    await transactionAPI
      .create(newTransaction)
      .then(() => {
        onUpdateTransaction({
          status: 1,
          message: "Return transaction is added successfully!",
        });
        handleClose();
      })
      .catch((error) => {
        onUpdateTransaction({ status: 0, message: error.response.data.error });
        handleClose();
        console.log(error.response.data.error);
      });
  }

  return (
    <BootstrapModal show={show} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>
          {editedTransaction ? "Edit Transaction" : "Add Transaction"}
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {loading &&
          (editedTransaction && editedTransaction.fullName ? (
            <p className="text-info">Editting Transaction ....</p>
          ) : (
            <p className="text-info">Adding Transaction ....</p>
          ))}
        <p>
          Transaction Code:{" "}
          <span className="fw-bold">
            {editedTransaction &&
              editedTransaction.code + "_" + editedTransaction._id}
          </span>
        </p>
        <table
          id="datatable"
          className="table table-bordered dt-responsive nowrap"
          style={{
            borderCollapse: "collapse",
            borderSpacing: 0,
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Item</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {editedTransaction &&
              productList &&
              productList.length > 0 &&
              productList.map((item, index) => {
                return (
                  <tr key={index}>
                    <td
                      className={
                        item.isReturned && "text-decoration-line-through"
                      }
                    >
                      {item.name}
                    </td>
                    <td>{item.value}</td>
                    <td>
                      <span onClick={() => handleReturnedItem(item, index)}>
                        <FaTrash className="text-info ms-2" />
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="form-group text-center">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary me-2"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleEditTransaction}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default TransactionModal;
