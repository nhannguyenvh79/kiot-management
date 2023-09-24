import React, { createContext, useContext, useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import ProductListRender from "../components/productListComponents/ProductListRender";
import ProductProvider from "../components/productProviderComponents/ProductProvider";
import AppContext from "../contexts/AppContext/AppContext";
import leftNavBarItems from "../global/leftNavBarItems";
export const productListContext = createContext();

const ProductList = () => {
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
    <productListContext.Provider value={{ setAlert }}>
      <div className="page-content px-2">
        <ProductProvider perPage={8}>
          <ProductListRender />
        </ProductProvider>
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
          delay={2000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Alert</strong>
            <small>Just now!</small>
          </Toast.Header>
          <Toast.Body>Update product list successfull!</Toast.Body>
        </Toast>
      </ToastContainer>
    </productListContext.Provider>
  );
};

export default ProductList;
