import { IDocument } from '../interfaces/document'
import { Model, model, Schema } from 'mongoose'
import { DocumentStatus } from '../enums/documentContract'

const DocumentSchema: Schema = new Schema(
  {
    subDocumentId: {
      type: Number,
      required: false,
    },
    documentName: {
      type: String,
      required: true,
    },
    accountId: {
      type: Number,
      required: true,
    },
    hashContent: {
      type: String,
      required: true,
    },
    documentStatus: {
      type: Number,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.PENDING,
    },
  },
  { timestamps: true }
)

const Document: Model<IDocument> = model('Document', DocumentSchema)

export default Document
