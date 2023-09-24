import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import SaleOffForm from "./SaleOffForm";
import { logo } from "../header/Header";

export default function AddSaleOffModal() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button
        className="mx-3 d-flex align-items-center"
        style={{ width: "fit-content" }}
        variant="primary"
        onClick={() => setShow(true)}
      >
        <span>Add Promotion</span>
        <MdOutlineAddCircleOutline className="text-light mx-1 fs-5" />
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
        className="saleoff-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="logo">
              <span>
                <img src={logo} alt="logo-small" className="logo-sm" />
              </span>
              <span>
                <div className="logo-lg">Add Promotion</div>
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SaleOffForm setShow={setShow} />
        </Modal.Body>
      </Modal>
    </>
  );
}
