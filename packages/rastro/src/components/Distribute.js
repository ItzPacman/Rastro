import React, { useState, useMemo } from "react";
import DistributePopup from "../PopUps/DistributePopup";
import { Link } from "react-router-dom";

const Distribute = ({RastroContractAddress}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [tokenAmount, settokenAmount] = useState([]);
  const [data, setData] = useState([]);
  const [bool, setBool] = useState([]);


  const [loading, setLoading] = useState("Batch Distribute");
  const [transaction, setTransaction] = useState("");

  const tronWeb = useMemo(() => {
    return window.tronWeb;
  }, []);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const batchdistribute = async () => {
    console.log(addresses, tokenAmount);

    if (!tronWeb) {
      console.error("TronWeb is not initialized.");
      return;
    }

    try {
      setLoading("Distributing...");

      const contract = await tronWeb.contract().at(RastroContractAddress);
      const trx = await contract.batchDistribute(addresses, tokenAmount).send();
      const txId = trx;

      setLoading("Batch Distribute");

      setTransaction(`https://tronscan.org/#/transaction/${txId}`);
      console.log(`https://tronscan.org/#/transaction/${txId}`);
    } catch (err) {
      console.error("Batch distribute error:", err.message);
      setLoading("Batch Distribute");
    }
  };

  return (
    <div className=" flex  mt-28 flex-col items-center justify-center">
      <div className="max-h-auto mx-auto max-w-xl">
        <div className="mb-8 space-y-3">
          <p className="text-xl font-semibold">Distribute Tokens</p>
          <p className="text-gray-500">
            Assign distributor addresses and allocate a specific amount of
            bearing tokens to each for distribution
          </p>
        </div>

        {/* Render the distributePopup component when isPopupOpen is true */}
        {isPopupOpen && (
          <DistributePopup
            addresses={addresses}
            setAddresses={setAddresses}
            tokenAmount={tokenAmount}
            settokenAmount={settokenAmount}
            bool={bool}
            setBool={setBool}
            batchdistribute={batchdistribute}
            setData={setData}
            data={data}
            isOpen={isPopupOpen}
            onClose={closePopup}
          />
        )}

        {/* Payment Details Table */}
        <div className="mx-auto mt-16  w-[100%] ">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-200 uppercase bg-[#2c749d] ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Amount</div>
                  </th>
                </tr>
              </thead>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tbody key={index}>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.address}
                      </th>
                      <td className="px-6 py-4">{item.Amount}</td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <h2 className=" p-4 text-lg">No Distributer added yet</h2>
              )}
            </table>
          </div>

          <div className="mt-10 flex justify-center space-x-4">
            <button
              onClick={openPopup}
              className="px-4 py-2 bg-gray-50 text-gray-700 font-semibold rounded-md"
            >
              Add Receipents
            </button>
            <button
              onClick={batchdistribute}
              className="px-4 py-2 text-sm text-center  font-semibold bg-[#2c749d] text-white rounded-md"
            >
              {loading}
            </button>
          </div>
          <Link
            className="text-gray-500 mt-4  flex justify-center items-center"
            to={transaction}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transaction !== "" ? "Click to View Transaction" : ""}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Distribute;
