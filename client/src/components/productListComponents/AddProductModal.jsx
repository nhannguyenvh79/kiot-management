import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ProductFrom from "./ProductForm";
import { logo } from "../header/Header";

export default function AddProductModal({ handleGetAllProduct }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button
        className="my-2 d-flex align-items-center "
        variant="primary"
        onClick={() => setShow(true)}
      >
        <span>Add Product</span>
        <MdOutlineAddCircleOutline className="text-light mx-1 fs-5" />
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
        className="product-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="logo">
              <span>
                <img src={logo} alt="logo-small" className="logo-sm" />
              </span>
              <span>
                <div className="logo-lg">Add product</div>
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductFrom
            setShow={setShow}
            handleGetAllProduct={handleGetAllProduct}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
