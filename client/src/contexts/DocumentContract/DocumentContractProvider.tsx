import React, { FC, createContext, useState, useEffect } from 'react'
import { IDocumentContract } from '../../interfaces/contract'
import json from '../../contracts/Document.json'
import useWeb3 from '../../hooks/web3'

const contextDefaultValues: IDocumentContract = {
  documentContract: undefined,
  documents: [],
  accounts: [],
}

export const DocumentContractContext =
  createContext<IDocumentContract>(contextDefaultValues)

const DocumentContextProvider: FC = ({ children }): any => {
  const { isLoading, isWeb3, web3, documents, accounts } = useWeb3()
  const [documentContract, setDocumentContract] = useState(
    contextDefaultValues.documentContract
  )

  const abi: any = json.abi

  useEffect(() => {
    const getDocumentContract = () => {
      if (web3 !== null) {
        const deployedNetwork = json.networks[5777]
        const instance = new web3.eth.Contract(
          abi,
          deployedNetwork && deployedNetwork.address
        )
        setDocumentContract(instance)
      }
    }

    getDocumentContract()
  }, [isLoading, isWeb3])

  return (
    <DocumentContractContext.Provider
      value={{ documentContract, documents, accounts }}
    >
      {children}
    </DocumentContractContext.Provider>
  )
}

export default DocumentContextProvider
