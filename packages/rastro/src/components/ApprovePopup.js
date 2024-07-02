import React, { useState } from 'react';
import './ApprovePopup.css'; // Import CSS for modal styling

const ApprovePopup = ({ isOpen, onClose ,setData ,data ,addresses , setAddresses , setDailyLimit , setBool   , dailyLimit , bool}) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [Limit, setLimit] = useState('');

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleDeposit = (event) => {
    event.preventDefault();

  };


  const handleApprove = (event) => {
    event.preventDefault();
    setData([...data, { address: walletAddress, limit: Limit }]);
    setAddresses([...addresses, walletAddress])
    setDailyLimit([...dailyLimit, Limit])
    setBool([...bool, true])
    console.log('Recipient Wallet Address:', walletAddress);
    console.log('Amount of Tokens:', Limit);
    onClose()
  

  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay bg-gray-50">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div >
          <div className="flex  flex-col items-center justify-center">
            <div className="max-h-auto mx-auto max-w-xl">
              <div className="mb-8 space-y-3">
                <p className="text-xl font-semibold">Add Vendors</p>
                <p className="text-gray-500">
                  Enter the vendor's wallet address, and specify the daily limit to withdraw.
                </p>
              </div>
              <form className="w-full" onSubmit={handleDeposit}>
                <div className="mb-6 space-y-2">
                  {/* Recipient's Wallet Address Input */}
                  <label className="text-sm font-medium leading-none" htmlFor="walletAddress">
                    Vendor's Wallet Address
                  </label>
                  <input
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    id="walletAddress"
                    placeholder="Enter recipient's wallet address"
                    name="walletAddress"
                    type="text"
                    value={walletAddress}
                    onChange={handleWalletAddressChange}
                  />
                </div>
                <div className="mb-10 space-y-2">
                  {/* Amount of Tokens Input */}
                  <label className="text-sm font-medium leading-none" htmlFor="Limit">
                    setDaily limit
                  </label>
                  <input
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    id="Limit"
                    placeholder="Enter daily withdrawal limit"
                    name="Limit"
                    type="text"
                    value={Limit}
                    onChange={handleLimitChange}
                  />
                </div>
                <button onClick={handleApprove}
                  className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#2c749d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2c749d]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  type="submit"
                >
                  Add Vendors
                </button>
              </form>
            
            </div>
          </div>
        </div>
      </div>

      
    </div>
    
  );
};

export default ApprovePopup;
