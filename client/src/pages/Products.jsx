import React, { useContext, useEffect } from "react";
import CartProvider from "../contexts/CartContext/CartProvider";
import Cart from "../components/productComponents/Cart";
import ProductProvider from "../components/productProviderComponents/ProductProvider";
import ProductRender from "../components/productComponents/ProductRender";
import AppContext from "../contexts/AppContext/AppContext";
import leftNavBarItems from "../global/leftNavBarItems";

const Products = () => {
  const { handleLeftSideBarSelectedItem } = useContext(AppContext);
  useEffect(() => {
    localStorage.setItem("currentUrl", window.location.pathname);
    const selectedItem = leftNavBarItems.filter(
      (item) => item.path === window.location.pathname
    )[0];
    handleLeftSideBarSelectedItem(selectedItem.id);
  }, []);
  return (
    <CartProvider>
      <div className="page-content">
        <ProductProvider perPage={15} rightSide={<Cart />}>
          <ProductRender />
        </ProductProvider>
      </div>
    </CartProvider>
  );
};

export default Products;
