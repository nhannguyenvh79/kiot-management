import React, { useState } from "react";
import accountAPI from "../../apis/accountAPI";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";

const Account = (props) => {
  const account = props.account;
  const [loading, setLoading] = useState(false);
  const activateAccount = async (id) => {
    console.log("id:", id);
    try {
      setLoading(true);
      await accountAPI.acceptById({ id: id });
      props.updateList();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr
      className={!account.active ? "table-secondary" : "table-primary"}
      style={{ height: 60 }}
    >
      <td>{account.username}</td>
      <td>{account.fullName}</td>
      <td>{account.phone}</td>
      <td>{account.email}</td>
      <td>{account.address}</td>
      {!(window.location.pathname.indexOf("pending") < 0) && (
        <>
          <td>{account.status}</td>
          {account.status === 1 ? (
            <td>Activated</td>
          ) : (
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => activateAccount(account._id)}
              >
                {loading ? "Activating" : "Activate"}
              </button>
            </td>
          )}
        </>
      )}

      {!(window.location.pathname.indexOf("pending") > -1) && (
        <>
          <td>{account.active ? "Yes" : "No"}</td>
          <td>{account.kiot_id}</td>
          <td>{account.role_id === 2 ? "Owner" : 3 && "Employee"}</td>
          <td>
            {new Date(account.createdAt).toLocaleDateString("en-US", {
              minute: "2-digit",
              hour: "2-digit",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </td>
          <td>
            {account.active ? (
              <>
                <span onClick={props.onEditAccount}>
                  <FaRegPenToSquare className="text-info ms-2" />
                </span>

                <span onClick={props.onDeleteAccount}>
                  <FaRegTrashCan className="text-danger ms-2" />
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={props.onEnableAccount}
                className="btn btn-primary pt-0 pb-0 ps-1 pe-1 btn-sm"
              >
                Enable
              </button>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

export default Account;
