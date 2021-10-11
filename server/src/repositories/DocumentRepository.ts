import { DocumentModel } from '../models'
import { IDocumentResp, IDocument, IDocumentVerify } from '../interfaces/document'

const documentUpload = (body: IDocumentResp) => {
  return DocumentModel.create(body)
}

const getAllDocuments = (): Promise<IDocument[]> => {
  return DocumentModel.find({}).exec();
}

const getDocumentsByStatus = (
  documentStatuses: string[] | string
): Promise<IDocument[]> => {
  // @ts-ignore
  return DocumentModel.find({
    documentStatus: { $in: documentStatuses },
  }).exec()
}

const updateDocStatusByAccIdSubDocId = async (
  subDocumentId: number,
  accountId: number,
  updatedStatus: number
): Promise<IDocumentVerify> => {
  // @ts-ignore
  return DocumentModel.findOneAndUpdate(
    {
      subDocumentId: subDocumentId,
      accountId: accountId,
    },
    {
      $set: {
        documentStatus: updatedStatus,
      },
    },
    {
      new: true,
    }
  )
}


export default {
  documentUpload,
  getAllDocuments,
  getDocumentsByStatus,
  updateDocStatusByAccIdSubDocId
}
