# Foood Chain Smart Contracts

**Requirements**
- NPM
- Node v16
- [Ganache](https://www.trufflesuite.com/ganache)

**Run App Locally**

Ensure that you have npm installed. On the root directory, run the below command to install the dependencies:

`$ npm install`

1. Compiling contract

Select the contract you want to compile in the `/migrations/2_deploy_contracts.js` file. On the root directory, run: 

`$ npm run compile`

2. Truffle Develop shell and contract migration

Open up the truffle develop shell, run:

`$ npm run develop`

At this point you should see the list of **account addresses**, **private keys** and **mnemonics**.
Take notes of this mnemonics.

3. Open up Ganache and configure a new workspace for foodie-chain. One of the requirements is that it should ask you to enter the mnenomics to link it to your local environment. The RPC Server on Ganache should be `http://127.0.0.1:7545/`.

4. Configure meta-mask on the chrome extension to point to `http://127.0.0.1:7545/`. There's an article that provides instructions on how to configure meta-task, which you can find [here](https://medium.com/fullstacked/connect-react-to-ethereum-b117986d56c1).

5. Migrate the smart contracts

`$ npm run migrate`
