import React, { FC, createContext, useState, useEffect } from 'react'
import { IProductContract } from '../../interfaces/contract'
import json from '../../contracts/ProductSC.json'
import useWeb3 from '../../hooks/web3'

const contextDefaultValues: IProductContract = {
  productContract: undefined,
}

export const ProductContractContext =
  createContext<IProductContract>(contextDefaultValues)

const ProductContextProvider: FC = ({ children }): any => {
  const { isLoading, isWeb3, web3 } = useWeb3()
  const [productContract, setProductContract] = useState(
    contextDefaultValues.productContract
  )

  const abi: any = json.abi

  useEffect(() => {
    const getProductContract = () => {
      if (web3 !== null) {
        const deployedNetwork = json.networks[5777]
        const instance = new web3.eth.Contract(
          abi,
          deployedNetwork && deployedNetwork.address
        )
        setProductContract(instance)
      }
    }

    getProductContract()
  }, [isLoading, isWeb3])

  return (
    <ProductContractContext.Provider
      value={{ productContract }}
    >
      {children}
    </ProductContractContext.Provider>
  )
}

export default ProductContextProvider
