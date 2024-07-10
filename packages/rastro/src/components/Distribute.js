import React, { useState, useMemo } from "react";
import DistributePopup from  "../PopUps/DistributePopup"
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import abi from  "../artifacts/RastroAbi.json"

const Distribute = ({}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [tokenAmount, settokenAmount] = useState([]);
  const [data, setData] = useState([]);
  const [bool, setBool] = useState([]);


  const [loading, setLoading] = useState("Batch Distribute");
  const [transaction, setTransaction] = useState("");


  const RastroFraxAddress ="0x62ABAa96727389E30Fc63503c9cCAf43cB423267"
  


  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };



  const batchdistributeFrax = async () => {
    console.log(addresses, tokenAmount);



    try {
      setLoading("Distributing...");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(RastroFraxAddress, abi.abi, signer);

      const distributeTrx = await contract.batchDistribute(addresses, tokenAmount);
      const txReceipt = await distributeTrx.wait();
      const approvetxId = txReceipt.transactionHash;
  
      setLoading("Batch Approve");
  
      setTransaction(`https://fraxscan.com/tx/${approvetxId}`);
      console.log(`https://fraxscan.com/tx/${approvetxId}`);
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
            batchdistribute={ batchdistributeFrax}
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
              onClick={batchdistributeFrax}
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