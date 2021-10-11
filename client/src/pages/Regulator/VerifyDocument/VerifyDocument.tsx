import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import { ProfileContractContext } from '../../../contexts/ProfileContract'
import { DocumentContractContext } from '../../../contexts/DocumentContract'
import { DocumentContractAPIContext } from '../../../contexts/DocumentContractAPI'
import DocumentsTable from '../../../components/DocumentsTable'
import { DocumentStatus } from '../../../enums/contract'
import { titleCase } from '../../../helpers'
import getAccounts from '../../../utils/getAccounts'

const VerifyDocument: FC = () => {
  const { accounts } = useContext(ProfileContractContext)
  //console.log("accounts 1", accounts)
  const { documentContract } = useContext(DocumentContractContext)
  const {
    pendingDocuments,
    approvedDocuments,
    rejectedDocuments,
    updateDocumentStatus,
  } = useContext(DocumentContractAPIContext)

  const [pendingDocumentsActiveClass, setPendingDocumentsActiveClass] =
    useState<string>('is-active')
  const [rejectedDocumentsActiveClass, setRejectedDocumentsActiveClass] =
    useState<string>('')
  const [approvedDocumentsActiveClass, setApprovedDocumentsActiveClass] =
    useState<string>('')

  const switchTab = (documentStatus: number) => {
    switch (documentStatus) {
      case DocumentStatus.Pending:
        setPendingDocumentsActiveClass('is-active')
        setRejectedDocumentsActiveClass('')
        setApprovedDocumentsActiveClass('')
        break
      case DocumentStatus.Rejected:
        setRejectedDocumentsActiveClass('is-active')
        setPendingDocumentsActiveClass('')
        setApprovedDocumentsActiveClass('')
        break
      case DocumentStatus.Approved:
        setApprovedDocumentsActiveClass('is-active')
        setPendingDocumentsActiveClass('')
        setRejectedDocumentsActiveClass('')
        break
      default:
        break
    }
  }

  const COLUMNS = [
    {
      Header: 'Account ID',
      accessor: 'accountId',
    },
    {
      Header: 'Sub Doc. ID',
      accessor: 'subDocumentId',
    },
    {
      Header: 'Document Name',
      accessor: 'documentName',
    },
    {
      Header: 'Document Hash',
      accessor: 'hashContent',
      Cell: ({
        value,
        row: {
          original: { documentName, accountAddress, documentStatus: originalDocumentStatus },
        },
      }: any) => {
        return (
          <a href={"https://ipfs.infura.io/ipfs/" + value} rel="noreferrer" target="_blank" download={documentName}>{value}</a>
        )
      },
    },
    // {
    //   Header: 'Document Type',
    //   accessor: 'docTypeValue',
    //   Cell: ({ value }: any) => {
    //     return titleCase(DocumentType[value])
    //   },
    // },
    {
      Header: 'Document Status',
      accessor: 'documentStatus',
      Cell: ({
        value,
        row: {
          original: { accountId, subDocumentId, documentStatus: originalDocumentStatus },
        },
      }: any) => {
        const handleChange = async (
          e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
          const { value: updateDocumentStatusValue } = e.target
          try {
            console.log("accounts", accounts)
            const _accounts = await getAccounts(accounts)

            const updateStatus = await documentContract?.methods
              .verifydocument(accountId, subDocumentId, updateDocumentStatusValue)
              .send({ from: _accounts[0] })
            if (updateStatus) {
              const
                {
                  accountId,
                  accountAddress,
                  subDocumentId,
                  documentStatus,
                }
                  = updateStatus.events.VerifyDocument.returnValues
              console.log("On-chain updatedStatus", documentStatus)
            }


            if (updateStatus) {
              updateDocumentStatus(
                subDocumentId,
                accountId,
                parseInt(updateDocumentStatusValue)
              )

              setTimeout(() => {
                switchTab(originalDocumentStatus)
              }, 200)
              switchTab(parseInt(updateDocumentStatusValue))
            }
          } catch (error) {
            console.log(error.message)
          }
        }

        return (
          <div className="select">
            <select
              defaultValue={value}
              name="accountType"
              id="accountType"
              onChange={handleChange}
            >
              {value === DocumentStatus.Pending && (
                <>
                  <option value={value}>
                    {titleCase(DocumentStatus[value])}
                  </option>
                  <option value={DocumentStatus.Rejected}>Reject</option>
                  <option value={DocumentStatus.Approved}>Approve</option>
                </>
              )}

              {value === DocumentStatus.Rejected && (
                <>
                  <option value={value}>
                    {titleCase(DocumentStatus[value])}
                  </option>
                  <option value={DocumentStatus.Pending}>Pending</option>
                  <option value={DocumentStatus.Approved}>Approve</option>
                </>
              )}

              {value === DocumentStatus.Approved && (
                <>
                  <option value={value}>
                    {titleCase(DocumentStatus[value])}
                  </option>
                  <option value={DocumentStatus.Pending}>Pending</option>
                  <option value={DocumentStatus.Rejected}>Reject</option>
                </>
              )}
            </select>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className="tabs is-centered is-boxed">
        <ul>
          <li
            className={pendingDocumentsActiveClass}
            onClick={() => switchTab(DocumentStatus.Pending)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-clock" aria-hidden="true" />
              </span>
              <span>Pending Documents ({pendingDocuments.length})</span>
            </a>
          </li>
          <li
            className={rejectedDocumentsActiveClass}
            onClick={() => switchTab(DocumentStatus.Rejected)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-times-circle" aria-hidden="true" />
              </span>
              <span>Rejected Documents ({rejectedDocuments.length})</span>
            </a>
          </li>
          <li
            className={approvedDocumentsActiveClass}
            onClick={() => switchTab(DocumentStatus.Approved)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-check-circle" aria-hidden="true" />
              </span>
              <span>Approved Documents ({approvedDocuments.length})</span>
            </a>
          </li>
        </ul>
      </div>
      <section className="container">
        {pendingDocumentsActiveClass && (
          <div className="column is-12">
            {!pendingDocuments.length ? (
              <div className="notification is-warning">
                No documents in pending.
              </div>
            ) : (
              <DocumentsTable columns={COLUMNS} data={pendingDocuments} />
            )}
          </div>
        )}

        {rejectedDocumentsActiveClass && (
          <div className="column is-12">
            {!rejectedDocuments.length ? (
              <div className="notification is-warning">
                No documents in rejected.
              </div>
            ) : (
              <DocumentsTable columns={COLUMNS} data={rejectedDocuments} />
            )}{' '}
          </div>
        )}

        {approvedDocumentsActiveClass && (
          <div className="column is-12">
            {!approvedDocuments.length ? (
              <div className="notification is-warning">
                No documents in approved.
              </div>
            ) : (
              <DocumentsTable columns={COLUMNS} data={approvedDocuments} />
            )}{' '}
          </div>
        )}
      </section>
    </>
  )
}

export default VerifyDocument
