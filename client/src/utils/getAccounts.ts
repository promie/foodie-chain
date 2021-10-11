// import Web3 from 'web3'

interface Window {
  ethereum: any
  addEventListener: any
}
declare const window: Window

const getAccounts = (defaultAccounts: string[]): Promise<string[]> =>
  new Promise((resolve, reject) => {
    // resolve(defaultAccounts);
    // return;

    try {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          resolve(accounts)
        })
        .catch((error: any) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('Please connect to MetaMask.')
          } else {
            console.error(error)
          }

          reject(defaultAccounts)
        })
    } catch {
      reject(defaultAccounts)
    }
  })

export default getAccounts
