import { Document } from 'mongoose'

export type IDocumentResp = Pick<
  IDocument,
  'id' | 'subDocumentId' | 'documentName' | 'accountId' | 'hashContent'
>

export type IDocumentVerify = Pick<
  IDocument,
  'subDocumentId' | 'documentName' | 'accountId' | 'hashContent' | 'documentStatus'
>

export interface IDocument extends Document {
  subDocumentId?: number
  documentName: string
  accountId: number
  hashContent: string
  documentStatus: number
}

