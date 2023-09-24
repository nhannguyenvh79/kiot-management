import React from "react";
import Cash from "./Cash";
import Visa from "./Visa";
import Momo from "./Momo";
import Banking from "./Banking";

const Method = (props) => {
  if (props.name === "cash") return <Cash {...props} />;
  if (props.name === "visa") return <Visa />;
  if (props.name === "momo") return <Momo />;
  if (props.name === "banking") return <Banking />;
  return <Cash />;
};

export default Method;
