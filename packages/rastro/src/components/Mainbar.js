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

const Mainbar = () => {
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

        await tronLink.request({ method: "tron_requestAccounts" });

        const address = tronWeb.defaultAddress.base58;
        setAddress(address);
        sessionStorage.setItem("address", address);
      }
    } catch (error) {
      console.error(error.message);
    }
     console.log(tronWeb.defaultAddress.base58);
  };



  const [isOpen, setIsOpen] = useState(false);
  


  return (
    <div className="bg-[#f3f4f7] min-w-screen font-main">
      <header className="w-full mt-5 text-gray-700 shadow-md body-font">
        <div className="flex items-center justify-evenly p-8 md:p-8">
          <div className="flex items-center space-x-2">
            <img
              alt="logo"
              height={30}
              width={30}
              src={logo}
              className="flex items-center"
            />
            <h6 className="font-bold text-lg">Rastro</h6>
          </div>
          <div className="hidden md:flex ml-10 space-x-6  justify-center">
            <button
              className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
              onClick={() => setActiveComponent("Deposit")}
            >
              Deposit
            </button>
            <button
              className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
              onClick={() => setActiveComponent("Approve")}
            >
              Approve
            </button>
            <button
              className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
              onClick={() => setActiveComponent("Distribute")}
            >
              Distribute
            </button>
            <button
              className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
              onClick={() => setActiveComponent("Redeem")}
            >
              Redeem
            </button>
            <button
              className="font-medium hover:underline-offset-4 hover:underline hover:text-gray-900"
              onClick={() => setActiveComponent("Transfer")}
            >
              Transfer
            </button>
          </div>
          <div className="flex items-center space-x-4 w-[10%] justify-center">
            <p className="font-medium hover:text-gray-900">
              {address
                ? `${address.slice(0, 4)}...${address.slice(-6)}`
                : ""}
            </p>
            <button
              onClick={connectToTronLink}
              className="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-[#2c749d] rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease"
            >
              {sessionStorage.getItem("address") === "false" ||
              sessionStorage.getItem("address") === null ||
              sessionStorage.getItem("address") === ""
                ? "Connect Wallet"
                : "Connected"}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-500 hover:text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="flex flex-col items-center space-y-4 py-5">
              <button
                className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
                onClick={() => setActiveComponent("Deposit")}
              >
                Deposit
              </button>
              <button
                className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
                onClick={() => setActiveComponent("Approve")}
              >
                Approve
              </button>
              <button
                className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
                onClick={() => setActiveComponent("Distribute")}
              >
                Distribute
              </button>
              <button
                className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
                onClick={() => setActiveComponent("Redeem")}
              >
                Redeem
              </button>
              <button
                className="hover:underline-offset-4 hover:underline font-medium hover:text-gray-900"
                onClick={() => setActiveComponent("Transfer")}
              >
                Transfer
              </button>
            </div>
          </div>
        )}
      </header>
      {renderComponent()}
      <Footer />
    </div>
  );
};

export default Mainbar;
