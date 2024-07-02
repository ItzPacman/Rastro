import React, { useState } from 'react';
import './DistributePopup.css'; // Import CSS for modal styling

const DistributePopup = ({ isOpen, onClose ,setData ,data ,addresses , setAddresses , settokenAmount    , tokenAmount }) => {
  const [ReceipentAddress, setReceipentAddress] = useState('');
  const [Amount, setAmount] = useState('');

  const handleReceipentAddressChange = (event) => {
    setReceipentAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleDeposit = (event) => {
    event.preventDefault();

  };


  const handleDistribute = (event) => {
    event.preventDefault();
    setData([...data, { address: ReceipentAddress, Amount: Amount }]);
    setAddresses([...addresses, ReceipentAddress])
    settokenAmount([...tokenAmount, Amount])
    console.log('Recipient Wallet Address:', ReceipentAddress);
    console.log('Amount of Tokens:', Amount);
    onClose()

  }

  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay bg-gray-50 ">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="">
          <div className="flex  flex-col items-center justify-center">
            <div className="max-h-auto mx-auto max-w-xl">
              <div className="mb-8 space-y-3">
                <p className="text-xl font-semibold">Add Receipents</p>
                <p className="text-gray-500">
                  Enter the recipient's wallet address, select the token, and specify the amount of tokens you want to distribute.
                </p>
              </div>
              <form className="w-full" onSubmit={handleDeposit}>
                <div className="mb-6 space-y-2">
                  {/* Recipient's Wallet Address Input */}
                  <label className="text-sm font-medium leading-none" htmlFor="ReceipentAddress">
                    Recipient's Wallet Address
                  </label>
                  <input
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    id="ReceipentAddress"
                    placeholder="Enter recipient's wallet address"
                    name="ReceipentAddress"
                    type="text"
                    value={ReceipentAddress}
                    onChange={handleReceipentAddressChange}
                  />
                </div>
                <div className="mb-10 space-y-2">
                  {/* Amount of Tokens Input */}
                  <label className="text-sm font-medium leading-none" htmlFor="Amount">
                    Amount of Tokens
                  </label>
                  <input
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    id="Amount"
                    placeholder="Enter amount of tokens"
                    name="Amount"
                    type="text"
                    value={Amount}
                    onChange={handleAmountChange}
                  /> 
                </div>
                <button onClick={handleDistribute}
                  className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#2c749d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2c749d]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  type="submit"
                >
                  Add Receipents
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>

      
    </div>
    
  );
};

export default DistributePopup;
