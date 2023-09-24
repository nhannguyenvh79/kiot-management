import React, { useContext, useEffect, useState } from "react";
import Kiot from "../components/kiotComponents/Kiot";
import kiotAPI from "../apis/kiotAPI";
import leftNavBarItems from "../global/leftNavBarItems";
import AppContext from "../contexts/AppContext/AppContext";

const Kiots = () => {
  const [kiots, setKiots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState();
  const handleClose = () => setAccountModalOpen(false);
  const handleShow = () => {
    setIsAddMode(true);
    setAccountModalOpen(true);
  };
  const [editedAccount, setEditedAccount] = useState();
  const [isAddMode, setIsAddMode] = useState(true);
  const { handleLeftSideBarSelectedItem } = useContext(AppContext);

  useEffect(() => {
    localStorage.setItem("currentUrl", window.location.pathname);
    const selectedItem = leftNavBarItems.filter(
      (item) => item.path === window.location.pathname
    )[0];
    handleLeftSideBarSelectedItem(selectedItem.id);
    fetchKiots(actionStatus);
  }, []);

  const fetchKiots = async (actionSt) => {
    setTimeoutAlert(actionSt);
    try {
      setLoading(true);
      const response = await kiotAPI.getAll();
      setKiots(response.data.data.kiotList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      // setAccountModalOpen(false)
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
  const handleEditKiot = (kiot) => {
    setIsAddMode(false);
    setEditedAccount(kiot);
    // setAccountModalOpen(true);
  };
  const dismissAlert = () => setActionStatus();
  const handleDeleteKiot = async (kiot) => {
    console.log(kiot);
    const deletedKiot = { ...kiot, active: false, kiot_id: kiot._id };
    console.log(deletedKiot);
    try {
      await kiotAPI.update(deletedKiot);
      fetchKiots({
        status: 1,
        message: "Kiot is deactivated successfully!",
      });
    } catch (error) {
      setActionStatus({ status: 0, message: "Error in deactivating kiot!" });
    }
  };

  const handleEnableKiot = async (kiot) => {
    const enabledKiot = { ...kiot, active: true, kiot_id: kiot._id };
    try {
      await kiotAPI.update(enabledKiot);
      fetchKiots({
        status: 1,
        message: "Kiot is enabled successfully!",
      });
    } catch (error) {
      setTimeoutAlert({ status: 0, message: "Error in enabling kiot!" });
    }
  };

  return (
    <div className="container-fluid mt-4">
      {loading ? (
        <p>Loading kiots ...</p>
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
                      <h4 className="mt-0 header-title">Kiot List</h4>
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
                            <th>Owner</th>
                            <th>Kiot Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Description</th>
                            <th>Active</th>
                            <th>Created At</th>
                            <th>Links</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kiots &&
                            kiots.length > 0 &&
                            kiots.map((kiot, index) => {
                              return (
                                <Kiot
                                  kiot={kiot}
                                  key={index}
                                  updateList={fetchKiots}
                                  onEditKiot={() => handleEditKiot(kiot)}
                                  onDeleteKiot={() => handleDeleteKiot(kiot)}
                                  onEnableKiot={() => handleEnableKiot(kiot)}
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
        </>
      )}
    </div>
  );
};

export default Kiots;
