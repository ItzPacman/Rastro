import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from  "../artifacts/RastroAbi.json"

const Deposit = ({}) => {


  const RastroFraxAddress ="0x62ABAa96727389E30Fc63503c9cCAf43cB423267"
  const USDT= "0xcc7aAcd634e9977Fb006f3EBA2a9A5a266fB9d88"
  const [transaction, setTransaction] = useState("");
  const [loading, setLoading] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  let  TokenAbi =[
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256)",
    "function balanceOf(address _owner) public view returns (uint256)",
    "function transfer(address _to, uint256 _value) public returns (bool success)"


  ]
  const decimals = 18;


  const ethereum = useMemo(() => window.ethereum, []);
  const provider = useMemo(() => new ethers.providers.Web3Provider(ethereum), [ethereum]);
  const signer = useMemo(() => provider.getSigner(), [provider]);

  const fetchTokenBalance = async () => {
    try {
      const contract = new ethers.Contract(USDT, TokenAbi, signer);
      const balanceInWei = await contract.balanceOf(await signer.getAddress());
      const balance = ethers.utils.formatUnits(balanceInWei, decimals);
      setTokenBalance(balance);
      console.log("Token balance:", Number(balance));
    } catch (err) {
      console.error("Error fetching token balance:", err.message);
    }
  };

  const fetchAllowance = async () => {
    try {
      const contract = new ethers.Contract(USDT, TokenAbi, signer);
      const allowanceInWei = await contract.allowance(await signer.getAddress(), RastroFraxAddress);
      setAllowance(ethers.utils.formatUnits(allowanceInWei, decimals));
      console.log("Allowance:", Number(allowanceInWei));
    } catch (err) {
      console.error("Error fetching allowance:", err.message);
    }
  };

  useEffect(() => {
    if (ethereum) {
      fetchTokenBalance();
      fetchAllowance();
    }
  }, [ethereum]);

  const depositFrax = async () => {
    setLoading("Depositing...");
    const rastroContract = new ethers.Contract(RastroFraxAddress, abi.abi, signer);
    const depositTx = await rastroContract.deposit(ethers.utils.parseUnits(amount, decimals));
    setLoading("Awaiting confirmation...");
    const txReceipt = await depositTx.wait();
    const txId = txReceipt.transactionHash;
    setTransaction(`https://fraxscan.com/tx/${txId}`);
    console.log(`Transaction ID: ${txId}`);
    setLoading("Deposit");
  };

  const checkApprovalAndDeposit = async () => {
    if (!ethereum) {
      toast.error("Please install MetaMask");
      return;
    }

    try {
      const tokenContract = new ethers.Contract(USDT, TokenAbi, signer);

      if (Number(tokenBalance) >= Number(amount)) {
        if (Number(allowance) >= Number(amount)) {
          await depositFrax();
        } else {
          setLoading("Approving...");
          const approveTx = await tokenContract.approve(RastroFraxAddress, ethers.utils.parseUnits(amount, decimals));
          await approveTx.wait();
          setTimeout(async () => {
            await depositFrax();
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
                <option value={USDT}>USDT</option>
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