import React, { FC, createContext, useState } from 'react'
import api from '../../api'
import {
  IProductLocation,
} from '../../interfaces/trace'

interface ITraceContractAPI {
  logs: IProductLocation[],
  queryLogs: (productId: number) => void,
}

const contextDefaultValues: ITraceContractAPI = {
  logs: [],
  queryLogs: () => {},
}

export const TraceContractAPIContext = createContext<ITraceContractAPI>(contextDefaultValues)

const TraceContextAPIProvider: FC = ({ children }): any => {
  const [logs, setLogs] = useState<IProductLocation[]>([])

  const queryLogs = async (productId: number) => {
    try {
      const resp = await api.post( '/v1/track/trace/' + productId )

      // @ts-ignore
      setLogs( resp.data.logs );
    } catch (err) {
      setLogs( [] );
    }
  }

  return (
    <TraceContractAPIContext.Provider
      value={{
        queryLogs,
        logs,
      }}
    >
      {children}
    </TraceContractAPIContext.Provider>
  )
}

export default TraceContextAPIProvider
