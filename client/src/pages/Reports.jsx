import React, { useEffect, useState } from 'react'
import Item from '../components/reportComponents/Item';
import { FaCartShopping, FaRegMoneyBill1, FaRetweet } from 'react-icons/fa6';
import transactionAPI from '../apis/transaction';

const Reports = () => {
  const [repost, setRepost] = useState([0, 0, 0]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      let newOrder = 0;
      let returnOrder = 0;
      let revenue = 0;
      const response = await transactionAPI.getAllByKiotId();
      response.data.data.transactionList.map(e => {
        if (e.status == 1) {
          newOrder += 1;
          if (e.value) {
            revenue += e.value
          }
        } else if (e.status == 2) {
          returnOrder += 1;
          if (e.returnV) {
            revenue -= e.returnV
          }
        }
      });

      setRepost([newOrder, returnOrder, revenue]);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className='row'>
        <div className="col-sm-12">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div
                    className="mt-0 header-title"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h4 className="mt-0 header-title">Report</h4>
                  </div>
                  <div className='row' style={{ justifyContent: "space-between" }}>
                    <Item name='New Orders' value={repost[0]} icon={<FaCartShopping className="card-eco-icon  align-self-center" />} />
                    <Item name='Return Orders' value={repost[1]} icon={<FaRetweet className="card-eco-icon  align-self-center" />} />
                    <Item name='Revenue' value={'$ '+ repost[2]} icon={<FaRegMoneyBill1 className="card-eco-icon  align-self-center" />} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>


      </div>
    </div>

  )
}

export default Reports;
