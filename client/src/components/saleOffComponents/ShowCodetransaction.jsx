import React, { useRef, useState } from "react";
import { Button, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";
import { PiBarcode } from "react-icons/pi";

const ShowCodetransaction = ({ code }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <>
      <span
        variant="text-secondary"
        ref={target}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <PiBarcode className="ms-2" />
      </span>

      <Overlay target={target.current} show={show} placement="right">
        {({
          placement: _placement,
          arrowProps: _arrowProps,
          show: _show,
          popper: _popper,
          hasDoneInitialMeasure: _hasDoneInitialMeasure,
          ...props
        }) => (
          <div
            {...props}
            style={{
              position: "absolute",
              backgroundColor: "gray",
              padding: "2px 10px",
              color: "white",
              borderRadius: 3,
              ...props.style,
            }}
          >
            Code: {code}
          </div>
        )}
      </Overlay>
    </>
    // <div>
    //   <OverlayTrigger
    //     placement="code"
    //     overlay={
    //       <Tooltip id="tooltip-code">
    //         <strong>code: {code}</strong>.
    //       </Tooltip>
    //     }
    //   >
    //     <Button variant="secondary">
    //       <PiBarcode className="ms-2" />
    //     </Button>
    //   </OverlayTrigger>
    // </div>
  );
};

export default ShowCodetransaction;
