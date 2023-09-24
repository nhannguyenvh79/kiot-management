import React from "react";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";

const Customer = (props) => {
  const customer = props.customer;

  return (
    <tr>
      <td>{customer.fullName}</td>
      <td>
        {customer.gender === 1
          ? "Male"
          : customer.gender === 2
          ? "Female"
          : "Other"}
      </td>
      <td>{customer.phone}</td>
      <td>{customer.email}</td>
      <td>{customer.address}</td>
      <td>{customer.rank}</td>
      <td>
        <span onClick={props.onEditCustomer}>
          <FaRegPenToSquare className="text-info ms-2" />
        </span>
      </td>
    </tr>
  );
};

export default Customer;
