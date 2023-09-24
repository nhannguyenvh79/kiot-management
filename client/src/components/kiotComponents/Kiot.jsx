import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";

const Kiot = (props) => {
  const kiot = props.kiot;

  return (
    <tr
      className={!kiot.active ? "table-secondary" : "table-primary"}
      style={{ height: 60 }}
    >
      <td>{kiot.username}</td>
      <td>{kiot.fullName}</td>
      <td>{kiot.phone}</td>
      <td>{kiot.email}</td>
      <td>{kiot.address}</td>
      <td>{kiot.describe}</td>
      <td>{kiot.active ? "Yes" : "No"}</td>
      <td>
        {new Date(kiot.createdAt).toLocaleDateString("en-US", {
          minute: "2-digit",
          hour: "2-digit",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>
      <td>
        <div className="d-flex flex-column p-2 bd-highlight">
          <Link to={`/productList?kiotId=${kiot._id}`}>Products</Link>
          <Link to={`/saleoffs?kiotId=${kiot._id}`}>SaleOffs</Link>
          <Link to={`/accounts?kiotId=${kiot._id}`}>Accounts</Link>
          <Link to={`/customers?kiotId=${kiot._id}`}>Customers</Link>
          <Link to="">Transactions</Link>
        </div>
      </td>
      <td>
        {kiot.active ? (
          <>
            <span onClick={props.onEditKiot}>
              <FaRegPenToSquare className="text-info ms-2" />
            </span>

            <span onClick={props.onDeleteKiot}>
              <FaRegTrashCan className="text-danger ms-2" />
            </span>
          </>
        ) : (
          <button
            type="button"
            onClick={props.onEnableKiot}
            className="btn btn-primary pt-0 pb-0 ps-1 pe-1 btn-sm"
          >
            Enable
          </button>
        )}
      </td>
    </tr>
  );
};

export default Kiot;
