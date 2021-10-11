// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const ProductSC = artifacts.require("ProductSC");
const Trace = artifacts.require("Trace");
const Profile = artifacts.require("Profile");
//const ProductRecall = artifacts.require("ProductRecall");
const fs = require('fs');


module.exports = async function (deployer, networks, addresses) {
  const regulator = addresses[0];
  const creator = addresses[1];
  const farmer = addresses[2];
  const manufacturer = addresses[3];
  const retailer = addresses[4];
  const logistic = addresses[5];
  const consumer = addresses[6];
  const oracle = addresses[7];

  ///await deployer.deploy(Profile, regulator, "Regulator", {from: creator});
  await Profile.deployed();
  await deployer.deploy(Trace, Profile.address, { from: regulator })
  const product = await deployer.deploy(ProductSC, Trace.address, Profile.address, { from: regulator });
  //Activate the product contract 
  await product.setActivatedMachineState({ from: regulator });


  const data = {
    regulator: regulator,
    creator: creator,
    farmer: farmer,
    manufacturer: manufacturer,
    retailer: retailer,
    logistic: logistic,
    consumer: consumer,
    oracle: oracle,
    trace: Trace.address,
    Profile: Profile.address,
    ProductSC: ProductSC.address,
  }

  fs.writeFileSync('addresses.json', JSON.stringify(data));
};
