// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const ProductSC = artifacts.require("ProductSC");
const Trace = artifacts.require("Trace");
const Profile = artifacts.require("Profile");
//const ProductRecall = artifacts.require("ProductRecall");
//const fs = require('fs');


module.exports = async function(deployer, networks, addresses) {
  const regulator = addresses[0];
  const creator = addresses[1];
  const farmer = addresses[2];
  const manufacturer = addresses[3];
  const retailer = addresses[4];
  const logistic = addresses[5];
  const consumer = addresses[6];
  const oracle = addresses[7];

  const profile = await Profile.deployed();
  const product = await ProductSC.deployed();
  const trace = await Trace.deployed();

  // await profile.registerAccount(farmer, "Farmer", 1, { from: farmer });
  // await profile.approveAccount(farmer, 1, { from: regulator });

  // await profile.registerAccount(manufacturer, "Manufacturer", 2, { from: manufacturer });
  // await profile.approveAccount(manufacturer, 1, { from: regulator });

  // await profile.registerAccount(retailer, "Retailer", 3, { from: retailer });
  // await profile.approveAccount(retailer, 1, { from: regulator });

  // await profile.registerAccount(consumer, "Consumer", 4, { from: consumer });
  // await profile.approveAccount(consumer, 1, { from: regulator });

  await profile.registerAccount(logistic, "Logistic", 5, { from: logistic });
  await profile.approveAccount(logistic, 1, { from: regulator });

  await profile.registerAccount(oracle, "Oracle", 6, { from: oracle });
  await profile.approveAccount(oracle, 1, { from: regulator });

  // var productAId = await product.createProduct.call("Product A", { from: farmer });

  // await product.addProductFarmingInfo(productAId, 1, 2);

  await trace.setProductContractAddress( product.address, {from: regulator} );
};
