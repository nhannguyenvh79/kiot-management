import React, { useContext, useEffect, useState } from "react";
import Account from "../components/accountComponents/Account";
import accountAPI from "../apis/accountAPI";
import AccountModal from "../components/accountComponents/AccountModal";
import { useLocation } from "react-router";
import AppContext from "../contexts/AppContext/AppContext";
import leftNavBarItems from "../global/leftNavBarItems";

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const handleClose = () => setAccountModalOpen(false);
  const handleShow = () => {
    setIsAddMode(true);
    setAccountModalOpen(true);
  };
  const { handleLeftSideBarSelectedItem } = useContext(AppContext);
  const [editedAccount, setEditedAccount] = useState();
  const [isAddMode, setIsAddMode] = useState(true);

  useEffect(() => {
    localStorage.setItem("currentUrl", window.location.pathname);
    const selectedItem = leftNavBarItems.filter(
      (item) => item.path === window.location.pathname
    )[0];
    handleLeftSideBarSelectedItem(selectedItem.id);
    fetchUsers(actionStatus);
  }, []);

  const fetchUsers = async (actionSt) => {
    setTimeoutAlert(actionSt);
    try {
      setLoading(true);
      const response = queryParams.get("kiotId")
        ? await accountAPI.getAllByKiotId(queryParams.get("kiotId"))
        : await accountAPI.getAll();
      setUsers(response.data.data.accountList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setAccountModalOpen(false);
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
  const handleEditAccount = (account) => {
    setIsAddMode(false);
    setEditedAccount(account);
    setAccountModalOpen(true);
  };
  const dismissAlert = () => setActionStatus();
  const handleDeleteaccount = async (account) => {
    const deletedAccount = { ...account, active: false, userId: account._id };
    try {
      await accountAPI.update(deletedAccount);
      fetchUsers({
        status: 1,
        message: "Account is deactivated successfully!",
      });
    } catch (error) {
      setActionStatus({ status: 0, message: "Error in deactivating account!" });
    }
  };

  const handleEnableAccount = async (account) => {
    const enabledAccount = { ...account, active: true, userId: account._id };
    try {
      await accountAPI.update(enabledAccount);
      fetchUsers({
        status: 1,
        message: "Account is enabled successfully!",
      });
    } catch (error) {
      setTimeoutAlert({ status: 0, message: "Error in enabling account!" });
    }
  };

  return (
    <div className="container-fluid mt-4">
      {loading ? (
        <p>Loading accounts ...</p>
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
                        <h4 className="mt-0 header-title">Account List</h4>
                        <button
                          className="btn btn-primary mb-4 fw-bolder "
                          type="button"
                          onClick={handleShow}
                        >
                          Add Account
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
                            <th>User Name</th>
                            <th>Full Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Active</th>
                            <th>Kiot ID</th>
                            <th>Role ID</th>
                            <th>Created At</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users &&
                            users.length > 0 &&
                            users.map((account, index) => {
                              return (
                                <Account
                                  account={account}
                                  key={index}
                                  updateList={fetchUsers}
                                  onEditAccount={() =>
                                    handleEditAccount(account)
                                  }
                                  onDeleteAccount={() =>
                                    handleDeleteaccount(account)
                                  }
                                  onEnableAccount={() =>
                                    handleEnableAccount(account)
                                  }
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
          <AccountModal
            show={accountModalOpen}
            handleClose={handleClose}
            onUpdateAccount={fetchUsers}
            editedAccount={editedAccount}
            isAddMode={isAddMode}
          />
        </>
      )}
    </div>
  );
};

export default Accounts;
