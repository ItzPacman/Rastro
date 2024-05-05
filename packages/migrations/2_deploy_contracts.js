var Rastro = artifacts.require("./Rastro.sol");
var USDD = artifacts.require("./USDD.sol");


const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',

});


module.exports = async function (deployer, network) {


let USDD_ADDRESS;


  if (network === 'shasta') {
    console.log("Deploying  contract...");

    try {
      await deployer.deploy(USDD);
      const USDDContract = await USDD.deployed();
      const USDDContracAddress = USDDContract.address;
      console.log('USDD Contract address', tronWeb.address.fromHex(USDDContracAddress))
      USDD_ADDRESS=tronWeb.address.fromHex(USDDContracAddress)


    } catch (error) {
      console.error("Error deploying Rastro lib:", error);
    } 

    try {
      await deployer.deploy(Rastro, USDD_ADDRESS);
      const RastroContract = await Rastro.deployed();
      const RastroContractAddress = RastroContract.address;
      console.log('Rastro Contract address', tronWeb.address.fromHex(RastroContractAddress))

    } catch (error) {
      console.error("Error deploying Rastro lib:", error);
    }


 
   
  }



};

// Rastro address TNqDxpdP3Ey7FHpy9iMQqzjA3R8wgHtG9P
// USDD address TVx3uronhu3uoVZb3fD2rNgQLtddFQsx9q
