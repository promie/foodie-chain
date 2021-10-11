import { ChangeEvent } from 'react'

type userType = 'regulator' | 'participant'

export interface IUserTypeProps {
  type: userType
}

export interface IProfileContract {
  profileContract: any
  accounts: string[]
}

export interface IMenuList {
  title: string
  link: string
}

export interface IAccountTypeDropdown {
  value: number
  account: string
}

export interface IRegisterAccountDetails {
  accountAddress: string
  accountName: string
  accountType: number
}

export interface IRegisterFormProps {
  showErrorNotice: boolean
  errorMessage: string
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  isAccountAddressFieldValid: boolean
  accountAddressFieldErrorMsg: string
  isAccountNameFieldValid: boolean
  isLoading: boolean
  handleRegister: (e: any) => Promise<void>
  accountType: number
}

export interface IViewAccountFormProps {
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleViewAccount: (e: any) => Promise<void>
  checked: boolean
  setChecked: (checked: boolean) => void
  isRegisteredAddressFieldValid: boolean
  isAccountAddressFieldValid: boolean
  accountAddressFieldErrorMsg: string
  isLoading: boolean
}

export interface IParticipantDetails {
  accountAddress: string
  accountId: number
  accountName: string
  accountStatus: number
  accountType: number
}

export interface IProfileContractAPI {
  registerParticipant: (participantDetails: IParticipantDetails) => void
  registeredAccounts: IParticipantDetails[]
  registrationError: boolean
  pendingAccounts: IParticipantDetails[]
  approvedAccounts: IParticipantDetails[]
  rejectedAccounts: IParticipantDetails[]
  updateAccountStatus: (address: string, updatedAccountStatus: number) => void
  getAllParticipants: () => void
}

export interface IViewAccountDetails {
  registeredAddress: string
  accountAddress: string
}

export interface IAccountStatus {
  accountId?: number | null
  accountName: string
  accountStatus: number | null
  accountType: number | null
  updated?: boolean
}

export interface IAccountsTableProps {
  columns: any
  data: IParticipantDetails[]
}

export interface IProductContract {
  productContract: any
}

export interface IProductContractAPI {
  recallProduct: any
  createProduct: any
  getProductsByStatus: any
  getProductById: any
  manuProductInfo: any
  shippingProductInfo: any
  retailProductInfo: any
  purchasingProductInfo: any
}

export interface IDocumentContract {
  documentContract: any
  documents: string[]
  accounts: string[]
}

export interface IDocumentPayload {
  accountId: number
  documentName: string
}

export interface IDocumentContractAPI {
  pendingDocuments: IDocumentDetails[]
  approvedDocuments: IDocumentDetails[]
  rejectedDocuments: IDocumentDetails[]
  //updateDocumentStatus: (address: string, updatedDocumentStatus: number) => void
  updateDocumentStatus: (
    subDocumentId: number,
    accountId: number,
    updatedAccountStatus: number
  ) => void
  getAllDocuments: () => void
  uploadDocument: any
  getDocumentHash: any
}

export interface IDocumentDetails {
  documentName: string
  docTypeValue: number
  referenceId: number
  hashContent: string
}

export interface IDocumentsTableProps {
  columns: any
  data: IDocumentDetails[]
}

export interface ITraceContract {
  traceContract: any
}

export type IFarmerProductInitial = Pick<
  IFarmerProductDetails,
  'productName' | 'productLocation'
>

export interface IFarmerProductDetails {
  productName: string
  productLocation: string
  farmDate: Date | string
  harvestDate: Date | string
}

export interface IManufacturerProcessDetails {
  productId: number | string
  processingType: string
}

export type IRetailProcessDetails = Pick<
  IManufacturerProcessDetails,
  'productId'
>

export interface IPurchaseProcessDetails {
  productId: number | string
  price: number | string
}

export interface ISendProductDetails {
  productId: number | string
  receiverAddress: string
  logisticsAddress: string
  trackNumber: string
}

export interface ICreateProductPayload {
  id?: number
  productId?: number | string
  productName: string
  productLocation: string
  farmDate: Date | string
  harvestDate: Date | string
  status?: number
}

export interface IManuProductInfoPayload {
  productId: number | string
  processingType: string
}

export interface IShippingProductInfoPayload {
  productId: number | string
  receiverAddress: string
  logisticsAddress: string
  trackingNumber: string
}

export interface ISupplyChainOneLine {
  farmerAddress: string
  manufacturerAddress: string
  distributorAddress: string
  retailerAddress: string
  ConsumerAddress: string
  statusType: number
}
