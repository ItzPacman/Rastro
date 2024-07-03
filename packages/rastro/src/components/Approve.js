import React, { useState, useMemo } from "react";
import ApprovePopup from "../PopUps/ApprovePopup";
import { Link } from "react-router-dom";

const Approve = ({RastroContractAddress}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [dailyLimit, setDailyLimit] = useState([]);
  const [bool, setBool] = useState([]);
  const [data, setData] = useState([]);


  const [loading, setLoading] = useState("Batch Approve");
  const [transaction, setTransaction] = useState("");

  const tronWeb = useMemo(() => {
    return window.tronWeb;
  }, []); // Include window.tronWeb in the dependency array

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const batchApprove = async () => {
    console.log(addresses, dailyLimit, bool);

    try {
      setLoading("Approving..");

      const contract = await tronWeb.contract().at(RastroContractAddress);
      const approvetrx = await contract
        .batchApproveMerchants(addresses, bool, dailyLimit)
        .send();
      console.log(addresses, dailyLimit, bool);
      const approvetxId = approvetrx;

      setLoading("Batch Approve");

      setTransaction(
        `https://tronscan.org/#/transaction/${approvetxId}`
      );
      console.log(`https://tronscan.org/#/transaction/${approvetxId}`);
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
            batchApprove={batchApprove}
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
                  <tbody  key={index}>
                    <tr className="bg-white border-b">
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
              onClick={batchApprove}
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
