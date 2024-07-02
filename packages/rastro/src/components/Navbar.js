import React, { useEffect, useMemo, useState } from "react";
import Deposit from "./Deposit.js";
import Redeem from "./Redeem.js";
import Distribute from "./Distribute.js";
import Approve from "./Approve.js";
import logo from "../images/logo.png";
import Footer from "./Footer.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Transfer from "./Transfer.js";
// import {ethers} from "ethers";

const Navbar = () => {
  const MySwal = withReactContent(Swal);

  const showAlert = () => {
    MySwal.fire({
      title: <p> Open TronLink and connect with Mainnet</p>,
      icon: "info",
      showCancelButton: false, // Hide cancel button
      showConfirmButton: true, // Hide confirm button
      confirmButtonColor: "#2c749d",
      iconColor: "#2c749d",

      customClass: {
        popup:
          "bg-[#f3f4f7] text-grey-900 text-md text-center rounded-lg font-main p-4", // Custom classes for the popup
      },
    });
  };

  try {
    if (tronWeb) {
      tronWeb.on("addressChanged", (address) => {
        window.location.reload();
        sessionStorage.setItem("address", address.base58);
        console.log("address", address.base58);
      });
    }
  } catch (e) {
    // console.log(e.message);
  }

  const [activeComponent, setActiveComponent] = useState("Deposit");
  const RastroContractAddress = "TFsHABHZMM6zY9G3GEGMAcrpCQiGMgoT54";
  const [address, setAddress] = useState(() =>
    sessionStorage.getItem("address")
  );

  const renderComponent = () => {
    switch (activeComponent) {
      case "Deposit":
        return <Deposit RastroContractAddress={RastroContractAddress} />;
      case "Redeem":
        return <Redeem RastroContractAddress={RastroContractAddress} />;
      case "Distribute":
        return <Distribute RastroContractAddress={RastroContractAddress} />;
      case "Approve":
        return <Approve RastroContractAddress={RastroContractAddress} />;
      case "Transfer":
        return <Transfer RastroContractAddress={RastroContractAddress} />;
      default:
        return null;
    }
  };

  const tronWeb = useMemo(() => {
    return window.tronWeb;
  }, []);

  const tronLink = useMemo(() => {
    return window.tronLink;
  }, []);

  try {
    if (tronWeb) {
      tronWeb.on("addressChanged", (address) => {
        window.location.reload();
        sessionStorage.setItem("address", address.base58);
        console.log("address", address.base58);
      });
    }
  } catch (e) {
    // console.log(e.message);
  }
  useEffect(() => {
    try {
      if (!tronWeb.defaultAddress.base58) {
        showAlert();
        return;
      }
    } catch (e) {
      // toast.error("Install tronLink wallet");
    }
  }, []);

  const connectToTronLink = async () => {
    try {
      if (!tronWeb.defaultAddress.base58) {
        showAlert();

        await tronLink.request({ method: "tron_requestAccounts" });

        const address = tronWeb.defaultAddress.base58;
        setAddress(address);
        sessionStorage.setItem("address", address);
      } else {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const accounts = await provider.send("eth_requestAccounts", []);
  //       const address = accounts[0];
  //       setAddress(address);
  //       console.log("Connected address:", address);
  //     } catch (error) {
  //       console.error("Error connecting wallet:", error);

  //     }
  //   } else {
  //     console.error("Ethereum object not found, install MetaMask.");

  //   }
  // };

  return (
    <div className="bg-[#f3f4f7] min-w-screen font-main">
      <header className="w-full mt-5 text-gray-700 shadow-md body-font">
        <div className="container flex flex-col items-start justify-between p-10 mx-auto md:flex-row">
          <h6 className="font-bold ml-2 text-lg">Rastro</h6>
          <img
            alt="logo"
            height={30}
            width={30}
            src={logo}
            className="flex items-center"
          />
          <nav className=" md:ml-auto md:mr-auto">
            <button
              className="mr-5  ml-20 font-medium hover:text-gray-900"
              onClick={() => setActiveComponent("Deposit")}
            >
              Deposit
            </button>

            <button
              className=" mr-5 font-medium hover:text-gray-900"
              onClick={() => setActiveComponent("Approve")}
            >
              Approve
            </button>

            <button
              className="mr-5 font-medium hover:text-gray-900"
              onClick={() => setActiveComponent("Distribute")}
            >
              Distribute
            </button>

            <button
              className="font-medium mr-5 hover:text-gray-900"
              onClick={() => setActiveComponent("Redeem")}
            >
              Redeem
            </button>

            <button
              className="font-medium mr-5 hover:text-gray-900"
              onClick={() => setActiveComponent("Transfer")}
            >
              Transfer
            </button>
          </nav>
          <div className="flex items-center space-x-4 justify-between">
            <p className="font-medium hover:text-gray-900">
              {address
                ? `${address.slice(0, 4)}...${address.slice(-6)}`
                : "No address connected"}
            </p>
            <button
              onClick={connectToTronLink}
              className="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-[#2c749d] rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease"
            >
              {sessionStorage.getItem("address") === "false" ||
              sessionStorage.getItem("address") === null ||
              sessionStorage.getItem("address") === ""
                ? "connect wallet"
                : "Connected"}
            </button>
          </div>
        </div>
      </header>
      {renderComponent()}
      <Footer />
    </div>
  );
};

export default Navbar;
