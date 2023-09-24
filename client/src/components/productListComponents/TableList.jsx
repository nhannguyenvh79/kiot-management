import React, { memo } from "react";
import Item from "./Item";

const TableList = ({ data }) => {
  return (
    <table id="datatable" className="table table-bordered dt-responsive nowrap">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Sale Off</th>
          <th>Active</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <Item product={item} key={item._id} />
        ))}
      </tbody>
    </table>
  );
};

export default memo(TableList);
