import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import abi from  "../artifacts/RastroAbi.json"
import ApprovePopup from "../PopUps/ApprovePopup"

const Approve = ({}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [dailyLimit, setDailyLimit] = useState([]);
  const [bool, setBool] = useState([]);
  const [data, setData] = useState([]);


   const RastroFraxAddress ="0x62ABAa96727389E30Fc63503c9cCAf43cB423267"

  const [loading, setLoading] = useState("Batch Approve");
  const [transaction, setTransaction] = useState("");


  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  


  const batchApproveFrax = async () => {
    console.log(addresses, dailyLimit, bool);
  
    try {
      setLoading("Approving...");
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(RastroFraxAddress, abi.abi, signer);
      const approvetrx = await contract.batchApproveMerchants(addresses, bool, dailyLimit);
      const txReceipt = await approvetrx.wait();
      const approvetxId = txReceipt.transactionHash;
  
      setLoading("Batch Approve");
  
      setTransaction(`https://fraxscan.com/tx/${approvetxId}`);
      console.log(`https://fraxscan.com/tx/${approvetxId}`);
    } catch (err) {
      console.error("Batch approval error:", err);
    }
  };
  

  return (
    <div className=" flex  mt-28 flex-col items-center justify-center">
      <div className="max-h-auto mx-auto max-w-xl">
        <div className="mb-8 space-y-3">
          <p className="text-xl font-semibold">Approve Vendors</p>
          <p className="text-gray-500">
            Add vendor addresses, approve them, and set a daily withdrawal limit
            for each vendor.
          </p>
        </div>

        {/* Render the ApprovePopup component when isPopupOpen is true */}
        {isPopupOpen && (
          <ApprovePopup
            addresses={addresses}
            setAddresses={setAddresses}
            dailyLimit={dailyLimit}
            setDailyLimit={setDailyLimit}
            bool={bool}
            setBool={setBool}
            batchApprove={batchApproveFrax}
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
                    <div className="flex items-center">Daily limit</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Date / Time</div>
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
                      <td className="px-6 py-4">{item.limit}</td>
                      <td className="px-6 py-4">
                        {" "}
                        {new Date().toLocaleTimeString()}
                      </td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <h2 className=" p-4 text-lg">No vendors added yet</h2>
              )}
            </table>
          </div>

          <div className="mt-10 flex justify-center space-x-4">
            <button
              onClick={openPopup}
              className="px-4 py-2 bg-gray-50 text-gray-700 font-semibold rounded-md"
            >
              Add vendors
            </button>
            <button
              onClick={batchApproveFrax}
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

export default Approve;