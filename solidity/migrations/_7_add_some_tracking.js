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

  var productBId = await product.createProduct.call("Product B",1,2,"location", { from: farmer });
  await product.createProduct("Product B",1,2,"location", { from: farmer });

  //await product.addProductFarmingInfo(productBId, 2, 3, { from: farmer });
  await product.manuProductInfo( productBId, "test", {from: manufacturer})

  await product.sendProduct(3, retailer, oracle, "DummyTrackingNumber2", {from: manufacturer});

  await trace.logLocation(3, 1234, 35, 35, {from: oracle});

  // await trace.requestForLocation(3, {from:farmer});

  await trace.logLocation(3, 1568, 36, 35, {from: oracle});
};
