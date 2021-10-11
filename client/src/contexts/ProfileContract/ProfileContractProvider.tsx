import React, { FC, createContext, useState, useEffect } from 'react'
import { IProfileContract } from '../../interfaces/contract'
import json from '../../contracts/Profile.json'
import useWeb3 from '../../hooks/web3'

const contextDefaultValues: IProfileContract = {
  profileContract: undefined,
  accounts: [],
}

export const ProfileContractContext =
  createContext<IProfileContract>(contextDefaultValues)

const ProfileContextProvider: FC = ({ children }): any => {
  const { isLoading, isWeb3, web3, accounts } = useWeb3()
  const [profileContract, setProfileContract] = useState(
    contextDefaultValues.profileContract
  )

  const abi: any = json.abi

  useEffect(() => {
    const getProfileContract = () => {
      if (web3 !== null) {
        const deployedNetwork = json.networks[5777]
        const instance = new web3.eth.Contract(
          abi,
          deployedNetwork && deployedNetwork.address
        )
        setProfileContract(instance)
      }
    }

    getProfileContract()
  }, [isLoading, isWeb3])

  return (
    <ProfileContractContext.Provider value={{ profileContract, accounts }}>
      {children}
    </ProfileContractContext.Provider>
  )
}

export default ProfileContextProvider
