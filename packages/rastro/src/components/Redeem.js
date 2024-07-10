import React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import abi from  "../artifacts/RastroAbi.json"



const Redeem = ({}) => {
 

  const [transaction, setTransaction] = useState("");
  const [loading, setLoading] = useState("Redeem");

  const [amount, setAmount] = useState([]);



  const RastroFraxAddress ="0x62ABAa96727389E30Fc63503c9cCAf43cB423267"
 

  let decimals=18
  const redeemFrax = async () => {

    setLoading("Depositing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const rastroContract = new ethers.Contract(RastroFraxAddress, abi.abi, signer);
    const depositTx = await rastroContract.redeemTokens(ethers.utils.parseUnits(amount, decimals));
    setLoading("Awaiting confirmation...");
    const txReceipt = await depositTx.wait();
    const txId = txReceipt.transactionHash;
    setTransaction(`https://fraxscan.com/tx/${txId}`);
    console.log(`Transaction ID: ${txId}`);
    setLoading("Deposit");
  };


  return (
    <div className="">
      <div className="flex mt-28 flex-col items-center justify-center">
        <div className="max-h-auto mx-auto max-w-xl">
          <div className="mb-8 space-y-3">
            <p className="text-xl font-semibold">Redeem Tokens</p>
            <p className="text-gray-500">
              Vendors: Enter your approved wallet address and the amount of
              tokens you wish to redeem.
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
                  Wallet address (optional)
                </label>
                <input
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  id="walletAddress"
                  placeholder="Enter recipient's wallet address"
                  name="walletAddress"
                  type="text"
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
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={redeemFrax}
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

export default Redeem;