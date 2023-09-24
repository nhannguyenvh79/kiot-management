import React, { useContext } from "react";
import EditSaleOffModal from "./EditSaleOffModal";
import { saleOffContext } from "./saleOffProvider/SaleOffProvider";

const Item = (props) => {
  const saleOff = props.saleOff;
  const { type } = useContext(saleOffContext);
  return (
    <tr>
      <td>{saleOff.name_product}</td>
      <td>{saleOff.price}%</td>
      <td>
        {saleOff.active ? (
          <p className="text-success m-0"> Yes</p>
        ) : (
          <p className="text-danger m-0">No</p>
        )}
      </td>

      {type === 2 && (
        <td>
          {saleOff.active ? (
            <p className="text-success m-0">{saleOff._id}</p>
          ) : (
            <p className="text-danger m-0">{saleOff._id}</p>
          )}
        </td>
      )}

      <td>
        <EditSaleOffModal saleOff={saleOff} />
      </td>
    </tr>
  );
};

export default Item;
