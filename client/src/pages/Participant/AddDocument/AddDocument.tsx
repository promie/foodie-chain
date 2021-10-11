import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import { DocumentContractContext } from '../../../contexts/DocumentContract'
import { DocumentContractAPIContext } from '../../../contexts/DocumentContractAPI'
import { ProfileContractAPIContext } from '../../../contexts/ProfileContractAPI'
import DocumentImage from '../../../assets/documents.png'
import './adddocument.css'
import { IParticipantDetails } from '../../../interfaces/contract'
import { titleCase } from '../../../helpers'
import { AccountType } from '../../../enums/contract'
import { shortenedAddress } from '../../../helpers/stringMutations'
import AddDocumentSuccess from '../../../components/AddDocumentSuccess'
import getAccounts from '../../../utils/getAccounts'

const AddDocument: FC = () => {
  const [accountId, setAccountId] = useState<{ accountId: number }>({
    accountId: -1,
  })
  const [address, setAddress] = useState<{ accountAddress: string }>({
    accountAddress: '',
  })
  const [documentName, setDocumentName] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [file, setFile] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [successDocumentContent, setSuccessDocumentContent] =
    useState(undefined)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const { documentContract, accounts } = useContext(DocumentContractContext)
  const { uploadDocument, getDocumentHash } = useContext(
    DocumentContractAPIContext
  )
  const { registeredAccounts, getAllParticipants } = useContext(
    ProfileContractAPIContext
  )

  useEffect(() => {
    getAllParticipants()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'accountId') {
      const splitVal = value.split(':')

      const id = splitVal[0]
      const sendAddress = splitVal[1]

      setAccountId({ ...accountId, ['accountId']: parseInt(id) })
      setAddress({ ...address, ['accountAddress']: sendAddress })
    }
  }

  const handleCaptureFile = (e: any) => {
    e.stopPropagation()
    e.preventDefault()

    const file = e.target.files[0]

    setFile(file)
    setDocumentName(file.name)
  }

  const handleFileUpload = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const _accounts = await getAccounts(accounts)

    const hashContent = await getDocumentHash(file)

    if (hashContent) {
      const addDocumentResp = await documentContract?.methods
        .addDocument(accountId.accountId, documentName, hashContent)
        .send({ from: _accounts[0] })
      if (addDocumentResp) {
        const {
          subDocumentId,
          documentName,
          accountId,
          documentStatus,
          hashContent,
        } = addDocumentResp.events.AddDocument.returnValues
        console.log('On-chain subDocumentId', subDocumentId)

        const document = await uploadDocument({
          subDocumentId,
          documentName,
          accountId,
          documentStatus,
          hashContent,
        })
        setSuccessDocumentContent(document)
        setUploadSuccess(true)
        setIsLoading(false)
      }
    }
  }

  const backToAddDocument = () => {
    setUploadSuccess(false)
    setDocumentName('')
    setFile('')
  }

  return (
    <div>
      <section className="container has-background-light">
        <div className="columns is-multiline">
          <div className="column is-10 is-offset-2">
            <div className="columns">
              <div className="column left mt-6 is-half">
                {!uploadSuccess ? (
                  <>
                    <h1 className="title is-4">Add Document</h1>
                    {error && (
                      <div className="notification is-danger is-light">
                        {errorMessage}
                      </div>
                    )}

                    <form className="mt-5">
                      <div className="select is-fullwidth">
                        <select
                          defaultValue={'DEFAULT'}
                          name="accountId"
                          id="accountId"
                          onChange={handleChange}
                        >
                          <option value={'DEFAULT'} disabled>
                            Select Account Address
                          </option>
                          {registeredAccounts?.map(
                            (account: IParticipantDetails, idx: number) => (
                              <option
                                key={idx}
                                value={`${account.accountId}:${account.accountAddress}`}
                              >
                                {`${account.accountName} (${titleCase(
                                  AccountType[account.accountType]
                                )}) [${shortenedAddress(
                                  account.accountAddress
                                )}`}
                                ]
                              </option>
                            )
                          )}

                          {!registeredAccounts.length && (
                            <option disabled>
                              Address Selection Unavailable
                            </option>
                          )}
                        </select>
                      </div>

                      <div className="file has-name is-primary mt-3 is-fullwidth">
                        <label className="file-label">
                          <input
                            className="file-input"
                            type="file"
                            name="resume"
                            onChange={handleCaptureFile}
                          />
                          <span className="file-cta">
                            <span className="file-icon">
                              <i className="fas fa-upload" />
                            </span>
                            <span className="file-label">Select file…</span>
                          </span>
                          <span className="file-name">{documentName}</span>
                        </label>
                      </div>

                      <button
                        className={
                          isLoading
                            ? 'button is-block is-link is-fullwidth mt-3 is-loading'
                            : 'button is-block is-link is-fullwidth mt-3'
                        }
                        disabled={
                          accountId.accountId === -1 || documentName === ''
                        }
                        onClick={(e) => handleFileUpload(e)}
                      >
                        Upload
                      </button>
                      <br />
                    </form>
                  </>
                ) : (
                  <AddDocumentSuccess
                    // @ts-ignore
                    documentName={successDocumentContent.documentName}
                    // @ts-ignore
                    hashContent={successDocumentContent.hashContent}
                    backToAddDocument={backToAddDocument}
                  />
                )}
              </div>
              <div className="column right has-text-centered is-half">
                <img
                  src={DocumentImage}
                  alt="registration infographics"
                  className="side-image-document"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AddDocument
