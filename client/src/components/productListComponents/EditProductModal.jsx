import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ProductFrom from "./ProductForm";
import { FaRegPenToSquare } from "react-icons/fa6";
import { logo } from "../header/Header";

export default function EditProductModal({ product }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <span className="my-1" variant="primary" onClick={() => setShow(true)}>
        <FaRegPenToSquare className="text-info ms-2" />
      </span>

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
                <div className="logo-lg">Edit product</div>
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductFrom setShow={setShow} product={product} />
        </Modal.Body>
      </Modal>
    </>
  );
}
