import React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ethers } from "ethers";
import abi from "../artifacts/RastroAbi.json";

const Transfer = ({  }) => {
  const [transaction, setTransaction] = useState("");
  const [loading, setLoading] = useState("Transfer");
  const [vendorWallet, setVendorWallet] = useState("");

  const [amount, setamount] = useState();

  const ethereum = useMemo(() => window.ethereum, []);
  const provider = useMemo(
    () => new ethers.providers.Web3Provider(ethereum),
    [ethereum]
  );
  const signer = useMemo(() => provider.getSigner(), [provider]);

  const RastroFraxAddress = "0x62ABAa96727389E30Fc63503c9cCAf43cB423267";
  let decimals=18

  const handleTransfer = async (event) => {
    event.preventDefault();

    setLoading("Transfering");

    try{
      const rastroContract = new ethers.Contract(
        RastroFraxAddress,
        abi.abi,
        signer
      );
      const depositTx = await rastroContract.transferBearingTokens(
        vendorWallet,
        ethers.utils.parseUnits(amount, decimals)
      );
      setLoading("Awaiting confirmation...");
      const txReceipt = await depositTx.wait();
      const txId = txReceipt.transactionHash;
      setTransaction(`https://fraxscan.com/tx/${txId}`);
      console.log(`Transaction ID: ${txId}`);
    }

    catch (err) {
      console.log(err.message);
      alert(err.message);
    }
   

    setLoading("Transfer");
  };

  
  return (
    <div className="">
      <div className="flex mt-28 flex-col items-center justify-center">
        <div className="max-h-auto mx-auto max-w-xl">
          <div className="mb-8 space-y-3">
            <p className="text-xl font-semibold">Transfer (Bearing Tokens)</p>
            <p className="text-gray-500">
              Enter vendor's approved wallet address and the amount of bearing
              tokens to Transfer.
            </p>
          </div>
          <form className="w-full">
            <div className="mb-10 space-y-3">
              <div className="space-y-2">
                {/* Recipient's Wallet Address Input */}
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="walletAddress"
                >
                  Vendor's wallet address
                </label>
                <input
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  id="walletAddress"
                  placeholder="Enter vendor's wallet address"
                  name="walletAddress"
                  type="text"
                  onChange={(e) => setVendorWallet(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                {/* Amount of Tokens Input */}
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="tokenAmount"
                >
                  Amount of Tokens
                </label>
                <input
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  id="tokenAmount"
                  placeholder="Enter amount of tokens"
                  name="tokenAmount"
                  type="text"
                  onChange={(e) => setamount(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleTransfer}
              className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#2c749d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2c749d]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {loading}
            </button>

            <Link
              className="text-gray-500 mt-4  flex justify-center items-center"
              target="_blank"
              rel="noopener noreferrer"
              to={transaction}
            >
              {transaction !== "" ? "Click to View Transaction" : ""}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
