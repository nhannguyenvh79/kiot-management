import React, { createContext, useContext, useEffect, useState } from "react";
import { Tab, Tabs, Toast, ToastContainer } from "react-bootstrap";
import SaleOffProductList from "../components/saleOffComponents/saleOffProductList/SaleOffProductList.render";
import SaleOffTransactionList from "../components/saleOffComponents/saleOffTransaction/saleOffTransaction.render";
import AddSaleOffModal from "../components/saleOffComponents/AddSaleOffModal";
import SaleOffProvider from "../components/saleOffComponents/saleOffProvider/SaleOffProvider";
import leftNavBarItems from "../global/leftNavBarItems";
import AppContext from "../contexts/AppContext/AppContext";

export const saleOffsContext = createContext();

const SaleOffs = () => {
  const [alert, setAlert] = useState(false);
  const { handleLeftSideBarSelectedItem } = useContext(AppContext);

  useEffect(() => {
    localStorage.setItem("currentUrl", window.location.pathname);
    const selectedItem = leftNavBarItems.filter(
      (item) => item.path === window.location.pathname
    )[0];
    handleLeftSideBarSelectedItem(selectedItem.id);
  }, []);
  return (
    <saleOffsContext.Provider value={{ setAlert }}>
      <div className="page-content container-fluid">
        <Tabs
          defaultActiveKey="product"
          id="uncontrolled-tab-example"
          className="promotion-title m-2 fs-6"
        >
          <Tab
            mountOnEnter={true}
            unmountOnExit={true}
            eventKey="product"
            title="Product's Promotions"
          >
            <SaleOffProvider type={1} perPage={5}>
              <AddSaleOffModal />
              <SaleOffProductList />
            </SaleOffProvider>
          </Tab>
          <Tab
            mountOnEnter={true}
            unmountOnExit={true}
            eventKey="transaction"
            title="Transaction's Promotions"
          >
            <SaleOffProvider type={2} perPage={5}>
              <AddSaleOffModal />
              <SaleOffTransactionList />
            </SaleOffProvider>
          </Tab>
        </Tabs>
      </div>

      <ToastContainer
        className="p-3"
        position="top-end"
        style={{ zIndex: 999 }}
      >
        <Toast
          show={alert}
          onClose={() => setAlert(false)}
          bg="success"
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Alert</strong>
            <small>Just now!</small>
          </Toast.Header>
          <Toast.Body>Update saleOff list successfull!</Toast.Body>
        </Toast>
      </ToastContainer>
    </saleOffsContext.Provider>
  );
};

export default SaleOffs;
