import React, { useContext, useEffect, useState } from "react";
import transactionAPI from "../apis/transaction";
import Transaction from "../components/transactionComponents/Transaction";
import TransactionModal from "../components/transactionComponents/TransactionModal";
import { useLocation } from "react-router";
import leftNavBarItems from "../global/leftNavBarItems";
import AppContext from "../contexts/AppContext/AppContext";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState();
  const handleClose = () => setTransactionModalOpen(false);

  const { handleLeftSideBarSelectedItem } = useContext(AppContext);
  const [editedTransaction, setEditedTransaction] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    localStorage.setItem("currentUrl", window.location.pathname);
    const selectedItem = leftNavBarItems.filter(
      (item) => item.path === window.location.pathname
    )[0];
    handleLeftSideBarSelectedItem(selectedItem.id);
    fetchTransactions(actionStatus);
  }, []);

  const fetchTransactions = async (actionSt) => {
    setTimeoutAlert(actionSt);
    try {
      setLoading(true);

      const response = queryParams.get("kiotId")
        ? await transactionAPI.getAllByKiotId(queryParams.get("kiotId"))
        : await transactionAPI.getAll();

      setTransactions(response.data.data.transactionList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTransactionModalOpen(false);
    }
  };
  const setTimeoutAlert = (actionSt) => {
    if (actionSt) {
      setActionStatus(actionSt);
      setTimeout(() => {
        setActionStatus();
      }, 5000);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditedTransaction(transaction);
    setTransactionModalOpen(true);
  };
  const dismissAlert = () => setActionStatus();

  return (
    <div className="container-fluid mt-4">
      {loading ? (
        <p>Loading transactions ...</p>
      ) : (
        <>
          {actionStatus && (
            <div
              class={
                actionStatus.status === 1
                  ? "alert alert-success alert-dismissible"
                  : "alert alert-danger alert-dismissible"
              }
            >
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                onClick={dismissAlert}
              ></button>

              <strong>{actionStatus.message}</strong>
            </div>
          )}
          <div className="row">
            <div className="col-sm-12">
              {/* account list */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="mt-0 header-title"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4 className="mt-0 header-title">Transaction List</h4>
                      </div>
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
                            <th>Username</th>
                            <th>Kiot Id</th>
                            <th>Status</th>
                            <th>Deposit</th>
                            <th>Return Value</th>
                            <th>Return List</th>
                            <th>Value</th>
                            <th>Product List</th>
                            <th>Code</th>
                            <th>Created At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions &&
                            transactions.length > 0 &&
                            transactions.map((transaction, index) => {
                              return (
                                <Transaction
                                  transaction={transaction}
                                  key={index}
                                  onEditTransaction={() => {
                                    handleEditTransaction(transaction);
                                  }}
                                />
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TransactionModal
            show={transactionModalOpen}
            handleClose={handleClose}
            onUpdateTransaction={fetchTransactions}
            editedTransaction={editedTransaction}
          />
        </>
      )}
    </div>
  );
};

export default Transactions;
