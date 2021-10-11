import React, { FC, createContext, useState, useEffect } from 'react'
import api from '../../api'
import {
  IDocumentContractAPI,
  IDocumentDetails,
  IDocumentPayload,
} from '../../interfaces/contract'
import { DocumentStatus } from '../../enums/contract'
const FormData = require('form-data')

const contextDefaultValues: IDocumentContractAPI = {
  pendingDocuments: [],
  approvedDocuments: [],
  rejectedDocuments: [],
  updateDocumentStatus: () => { },
  getAllDocuments: () => { },
  uploadDocument: () => { },
  getDocumentHash: () => { },
}

export const DocumentContractAPIContext =
  createContext<IDocumentContractAPI>(contextDefaultValues)

const DocumentContractAPIProvider: FC = ({ children }): any => {
  const [pendingDocuments, setPendingDocuments] = useState<IDocumentDetails[]>(
    []
  )
  const [approvedDocuments, setApprovedDocuments] = useState<
    IDocumentDetails[]
  >([])
  const [rejectedDocuments, setRejectedDocuments] = useState<
    IDocumentDetails[]
  >([])

  useEffect(() => {
    getAllDocuments()
  }, [])

  const getAllDocuments = async () => {
    await getDocumentsByStatus(DocumentStatus.Pending)
    await getDocumentsByStatus(DocumentStatus.Approved)
    await getDocumentsByStatus(DocumentStatus.Rejected)
  }

  const getDocumentsByStatus = async (documentStatus: number) => {
    try {
      const resp = await api.get(
        `/v1/documents/status?documentStatus=${documentStatus}`
      )

      switch (documentStatus) {
        case DocumentStatus.Pending:
          setPendingDocuments(resp.data.documents)
          break
        case DocumentStatus.Approved:
          setApprovedDocuments(resp.data.documents)
          break
        case DocumentStatus.Rejected:
          setRejectedDocuments(resp.data.documents)
          break
        default:
          break
      }
    } catch (err) {
      console.log(err)
    }
  }

  /*
  const updateDocumentStatus = async (
    address: string,
    updatedDocumentStatus: number
  ) => {
    try {
      console.log('address', address)
      console.log('updatedDocumentStatus', updatedDocumentStatus)

      const resp = await api.patch(`/v1/document/${address}`, {
        documenStatus: updatedDocumentStatus,
      })

      switch (updatedDocumentStatus) {
        case DocumentStatus.Pending:
          setPendingDocuments(resp.data.documents)
          break
        case DocumentStatus.Approved:
          setApprovedDocuments(resp.data.documents)
          break
        case DocumentStatus.Rejected:
          setRejectedDocuments(resp.data.documents)
          break
        default:
          break
      }

      getAllDocuments()
    } catch (err) {
      console.log(err)
    }
  }
*/

  const updateDocumentStatus = async (
    subDocumentId: number,
    accountId: number,
    updatedDocumentStatus: number
  ) => {
    try {
      console.log('subDocumentId', subDocumentId)
      console.log('accountId', accountId)
      console.log('updatedDocumentStatus', updatedDocumentStatus)

      const resp = await api.patch(`/v1/documents/verify/?subDocumentId=${subDocumentId}&accountId=${accountId}`, {
        documentStatus: updatedDocumentStatus,
      })

      switch (updatedDocumentStatus) {
        case DocumentStatus.Pending:
          setPendingDocuments(resp.data.documents)
          break
        case DocumentStatus.Approved:
          setApprovedDocuments(resp.data.documents)
          break
        case DocumentStatus.Rejected:
          setRejectedDocuments(resp.data.documents)
          break
        default:
          break
      }

      getAllDocuments()
    } catch (err) {
      console.log(err)
    }
  }

  const uploadDocument = async (
    payload: IDocumentPayload
  ) => {
    try {


      const resp = await api.post('/v1/documents', payload)
      console.log("payload", payload)
      return resp.data.document
    } catch (e) {
      console.log(e)
    }
  }

  const getDocumentHash = async (
    file: File | string
  ) => {
    try {
      const formData = new FormData()

      // @ts-ignore
      formData.append('document', file)

      const resp = await api.post('/v1/documents/hash', formData)

      return resp.data.hashContent
    } catch (e) {
      console.log(e)
    }
  }



  return (
    <DocumentContractAPIContext.Provider
      value={{
        pendingDocuments,
        approvedDocuments,
        rejectedDocuments,
        updateDocumentStatus,
        getAllDocuments,
        uploadDocument,
        getDocumentHash
      }}
    >
      {children}
    </DocumentContractAPIContext.Provider>
  )
}

export default DocumentContractAPIProvider
