import React, { FC, createContext, useState, useEffect } from 'react'
import { ITraceContract } from '../../interfaces/contract'
import json from '../../contracts/Trace.json'
import useWeb3 from '../../hooks/web3'

const contextDefaultValues: ITraceContract = {
  traceContract: undefined,
}

export const TraceContractContext =
  createContext<ITraceContract>(contextDefaultValues)

const TraceContextProvider: FC = ({ children }): any => {
  const { isLoading, isWeb3, web3 } = useWeb3()
  const [traceContract, setTraceContract] = useState(
    contextDefaultValues.traceContract
  )

  const abi: any = json.abi

  useEffect(() => {
    const getTraceContract = () => {
      if (web3 !== null) {
        const deployedNetwork = json.networks[5777]
        const instance = new web3.eth.Contract(
          abi,
          deployedNetwork && deployedNetwork.address
        )
        setTraceContract(instance)
      }
    }

    getTraceContract()
  }, [isLoading, isWeb3])

  return (
    <TraceContractContext.Provider value={{ traceContract }}>
      {children}
    </TraceContractContext.Provider>
  )
}

export default TraceContextProvider
