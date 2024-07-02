import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Deposit = ({RastroContractAddress}) => {

  const USDDTokenAddress = "TR3FAxxGLFwRh8daUtjiosU8zSsohpBF73"; // ERC20 USDD Token Address

  const [transaction, setTransaction] = useState("");
  const [loading, setLoading] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);



  const  tronWeb  = useMemo(() => {
    return window.tronWeb;
  }, []);


  const fetchTokenBalance = async () => {
    try {
      const contract = await tronWeb.contract().at(USDDTokenAddress);
      const balanceInSun = await contract
        .balanceOf(tronWeb.defaultAddress.base58)
        .call();
      const decimals = 18; // USDD has 18 decimals
      const balance = balanceInSun / Math.pow(10, decimals);
      setTokenBalance(balance);
      console.log("Token balance:", Number(balance));
    } catch (err) {
      console.error("Error fetching token balance:", err.message);
    }
  };

  const fetchAllowance = async () => {
    if (!tronWeb) {
      console.error("TronWeb is not initialized.");
      return;
    }

    try {
      const contract = await tronWeb.contract().at(USDDTokenAddress);
      const allowance = await contract
        .allowance(tronWeb.defaultAddress.base58, RastroContractAddress)
        .call();
      setAllowance(allowance);
      console.log("Allowance:", Number(allowance));
    } catch (err) {
      console.error("Error fetching allowance:", err.message);
    }
  };

  useEffect(() => {
  
    if (tronWeb) {
      fetchTokenBalance();
      fetchAllowance();
    }
  }, [tronWeb]);



  const deposit = async () => {
    setLoading("Depositing...");
    const rastroContract = await tronWeb.contract().at(RastroContractAddress);
    const depositTrx = await rastroContract.deposit(tronWeb.toHex(amount)).send();

    setLoading("Awaiting confirmation...");
    const txId = depositTrx; // The transaction ID
    setTransaction(`https://tronscan.org/#/transaction/${txId}`);
    console.log(`Transaction ID: ${txId}`);
    setLoading("Deposit");
  };

  const checkApprovalAndDeposit = async () => {
    if (!tronWeb) {
      toast.error("Please install Tron wallet");
      return;
    }

    try {
      const tokenContract = await tronWeb.contract().at(USDDTokenAddress);

      if (Number(tokenBalance) >= Number(amount)) {
        if (Number(allowance) >= Number(amount)) {
          deposit();
        } else {
          setLoading("Approving...");

          await tokenContract
            .approve(RastroContractAddress, tronWeb.toHex(amount))
            .send();

          setTimeout(() => {
            deposit();
          }, 2000);
        }
      } else {
        toast.error("Insufficient token balance");
      }
    } catch (err) {
      console.error("Error during deposit:", err.message);
      toast.error("Error during deposit: " + err.message);
      setLoading("Deposit failed");

      setTimeout(() => {
        setLoading("Deposit");
      }, 3000);
    }
  };




  return (
    <div className="">
      <div className="flex mt-28 flex-col items-center justify-center">
        <div className="max-h-auto mx-auto max-w-xl">
          <div className="mb-8 space-y-3">
            <p className="text-xl font-semibold">Deposit Tokens</p>
            <p className="text-gray-500">
              Select the token and specify the amount of tokens you want to
              deposit to the vault.
            </p>
          </div>
          <form className="w-full">
            <div className="mb-6 space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="tokenType"
              >
                Token
              </label>
              <select
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                id="tokenType"
                name="tokenType"
              >
                <option value={USDDTokenAddress}>USDD</option>
                {/* Add more options for other token types if needed */}
              </select>
            </div>
            <div className="mb-10 space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="tokenAmount"
              >
                Amount of Tokens
              </label>
              <input
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                id="tokenAmount"
                placeholder="Enter amount of tokens"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={checkApprovalAndDeposit}
              className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#2c749d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {loading}
            </button>

            <Link
              className="text-gray-500 mt-4 flex justify-center items-center"
              to={transaction}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transaction !== "" ? "Click to View Transaction" : ""}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
