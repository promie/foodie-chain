// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const Profile = artifacts.require("Profile");
const Document = artifacts.require("Document");

module.exports = async function (deployer, network, accounts) {

  // NOTE: Please ensure to enter 2 parameters when deploying Profile contract
  //deployer.deploy(Profile, <address>, <regulator_name>);
  // Assign account index 0 is the regulator
  const regulator = accounts[0];

  await deployer.deploy(Profile, regulator, "regulator");

  const profile = await Profile.deployed();
  //Activate the profile contract and Enable register function by the regulator.
  await profile.setActivatedMachineState({ from: regulator });

  await deployer.deploy(Document, Profile.address);
  const document = await Document.deployed();
  //Activate the document contract 
  await document.setActivatedMachineState({ from: regulator });

};
