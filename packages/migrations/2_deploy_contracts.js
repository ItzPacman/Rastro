var Rastro = artifacts.require("./Rastro.sol");
// var USDD = artifacts.require("./USDD.sol");
const tronWeb = require("tronweb");


module.exports = async function (deployer, network) {

  
  console.log("network", network);
  


  if (network === "mainnet") {
    console.log("Deploying  contract...");

    // try {
    //   await deployer.deploy(USDD);
    //   const USDDContract = await USDD.deployed();
    //   const USDDContracAddress = USDDContract.address;
    //   console.log(
    //     "USDD Contract address",
    //     tronWeb.address.fromHex(USDDContracAddress)
    //   );
      
    // } catch (error) {
    //   console.error("Error deploying USDD :", error.message);
    // }

    try {
      await deployer.deploy(Rastro, "TR3FAxxGLFwRh8daUtjiosU8zSsohpBF73");
      const RastroContract = await Rastro.deployed();
      const RastroContractAddress = RastroContract.address;
      console.log(
        "Rastro Contract address",
        tronWeb.address.fromHex(RastroContractAddress)
      );
    } catch (error) {
      console.error("Error deploying Rastro lib:", error);
    }
   }
};

// Rastro address TFsHABHZMM6zY9G3GEGMAcrpCQiGMgoT54
// USDD address TR3FAxxGLFwRh8daUtjiosU8zSsohpBF73
