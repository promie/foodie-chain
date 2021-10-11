import fs from 'fs'
import { DocumentRepository } from '../repositories'
import { IDocumentResp, IDocument, IDocumentVerify } from '../interfaces/document'
const ipfsAPI = require('ipfs-api')
const NodeRSA = require('node-rsa')
const path = require('path')

const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

const documentUpload = (
  body: IDocument
) => {
  try {
    return DocumentRepository.documentUpload(body)
  } catch (err) {
    console.log(err)
  }
}


//TODO : Must get subDocumentId from on-chain before inserting doc tx to mongo
const getDocumentHash = async (
  fileContent: File | undefined | Express.Multer.File
) => {
  // @ts-ignore
  const data = new Buffer(fs.readFileSync(fileContent.path))
  const publicKey = fs.readFileSync(
    path.join(__dirname, '../../keys/public.pem')
  )

  const key = new NodeRSA(publicKey)

  // write encrypted file
  const encrypted = key.encrypt(data)
  // @ts-ignore
  fs.writeFileSync(fileContent.path + '.encrypted', encrypted, 'utf8')
  // fs.rmSync( fileContent.path );

  try {
    const file = await ipfs.add(encrypted)

    return file[0].hash

  } catch (err) {
    console.log(err)
  }
}

const getAllDocuments = async (): Promise<IDocument[]> => {
  try {
    const documents = await DocumentRepository.getAllDocuments()

    return documents
  } catch (err) {
    console.log(err)
    return []
  }
}

const getDocumentsByStatus = async (
  documentStatus: string[] | string
): Promise<IDocument[]> => {
  const documents = await DocumentRepository.getDocumentsByStatus(
    documentStatus
  )

  return documents
}


const updateDocStatusByAccIdSubDocId = async (
  subDocumentId: number,
  accountId: number,
  updatedStatus: number
): Promise<IDocumentVerify> => {
  //console.log("subDocumentId", subDocumentId)
  //console.log("accountId", accountId)
  const updatedDocument =
    await DocumentRepository.updateDocStatusByAccIdSubDocId(
      subDocumentId,
      accountId,
      updatedStatus
    )
  return {
    subDocumentId: updatedDocument.subDocumentId,
    documentName: updatedDocument.documentName,
    accountId: updatedDocument.accountId,
    hashContent: updatedDocument.hashContent,
    documentStatus: updatedDocument.documentStatus,
  }
}

export default {
  documentUpload,
  getDocumentHash,
  getAllDocuments,
  getDocumentsByStatus,
  updateDocStatusByAccIdSubDocId
}

