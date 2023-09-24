import React, { useContext, useEffect, useState } from "react";
import customerAPI from "../apis/customerAPI";
import Customer from "../components/customerComponents/Customer";
import CustomerModal from "../components/customerComponents/CustomerModal";
import { useLocation } from "react-router";
import leftNavBarItems from "../global/leftNavBarItems";
import AppContext from "../contexts/AppContext/AppContext";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState();
  const handleClose = () => setCustomerModalOpen(false);
  const handleShow = () => {
    setIsAddMode(true);
    setCustomerModalOpen(true);
  };
  const { handleLeftSideBarSelectedItem } = useContext(AppContext);
  const [editedCustomer, setEditedCustomer] = useState();
  const [isAddMode, setIsAddMode] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    localStorage.setItem("currentUrl",window.location.pathname)
    const selectedItem = leftNavBarItems.filter(
      (item) => item.path === window.location.pathname
    )[0];
    handleLeftSideBarSelectedItem(selectedItem.id);
    fetchCustomers(actionStatus);
  }, []);

  const fetchCustomers = async (actionSt) => {
    setTimeoutAlert(actionSt);
    try {
      setLoading(true);

      const response = queryParams.get("kiotId")
        ? await customerAPI.getAllByKiotId(queryParams.get("kiotId"))
        : await customerAPI.getAll();

      setCustomers(response.data.data.customerList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setCustomerModalOpen(false);
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

  const handleEditCustomer = (customer) => {
    setIsAddMode(false);
    setEditedCustomer(customer);
    setCustomerModalOpen(true);
  };
  const dismissAlert = () => setActionStatus();

  return (
    <div className="container-fluid mt-4">
      {loading ? (
        <p>Loading customers ...</p>
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
                        <h4 className="mt-0 header-title">Customer List</h4>
                        <button
                          className="btn btn-primary mb-4 fw-bolder "
                          type="button"
                          onClick={handleShow}
                        >
                          Add Customer
                        </button>
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
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Rank</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers &&
                            customers.length > 0 &&
                            customers.map((customer, index) => {
                              return (
                                <Customer
                                  customer={customer}
                                  key={index}
                                  onEditCustomer={() => {
                                    handleEditCustomer(customer);
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
          <CustomerModal
            show={customerModalOpen}
            handleClose={handleClose}
            onUpdateCustomer={fetchCustomers}
            editedCustomer={editedCustomer}
            isAddMode={isAddMode}
          />
        </>
      )}
    </div>
  );
};

export default Customers;
