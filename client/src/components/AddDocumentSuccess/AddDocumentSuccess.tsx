import React, { FC } from 'react'
import './adddocumentsuccess.css'

interface IAddDocumentSuccessProps {
  documentName: string
  hashContent: string
  backToAddDocument: () => void
}

const AddDocumentSuccess: FC<IAddDocumentSuccessProps> = ({
  documentName,
  hashContent,
  backToAddDocument,
}) => {
  return (
    <div className="upload-success mb-3">
      <div className="icon-text upload-check-icon">
        <span className="icon has-text-success">
          <i className="fas fa-check-circle" />
        </span>
      </div>
      <div className="mt-5">
        <div className="notification is-info is-light upload-notification">
          <div>Congratulations!</div>
          <div>
            The file <strong>{documentName}</strong> upload was successful.
          </div>
          <div className="mt-5">
            Your document is currently pending review. For reference, please
            take not of the file hash content:
          </div>
          <div className="hash-content mt-3">
            <strong>{hashContent}</strong>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <button className="button is-link" onClick={() => backToAddDocument()}>
          Back to Add Document{' '}
        </button>
      </div>
    </div>
  )
}

export default AddDocumentSuccess
