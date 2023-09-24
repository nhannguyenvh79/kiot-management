import { useContext } from "react";
import TableList from "../TableList";
import { saleOffContext } from "../saleOffProvider/SaleOffProvider";

const SaleOffTransactionList = () => {
  const SaleOffTransactionProps = useContext(saleOffContext);

  return (
    <div className="mt-2">
      <TableList data={SaleOffTransactionProps.currentData} />
    </div>
  );
};

export default SaleOffTransactionList;
