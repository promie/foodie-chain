import React, { ChangeEvent, FC, useState, useContext, useEffect } from 'react'
import format from 'date-fns/format'
import {
  ICreateProductPayload,
  ISendProductDetails,
} from '../../interfaces/contract'
import './shipping.css'
import { ProductStatus } from '../../enums/contract'
import { ProductContractAPIContext } from '../../contexts/ProductContractAPI'
import { ProfileContractContext } from '../../contexts/ProfileContract'
import { ProductContractContext } from '../../contexts/ProductContract'
import getAccounts from '../../utils/getAccounts'

const sendProductInitialState: ISendProductDetails = {
  productId: 'DEFAULT',
  receiverAddress: '',
  logisticsAddress: '',
  trackNumber: '',
}

const Shipping: FC = () => {
  const { getProductsByStatus, getProductById, shippingProductInfo } =
    useContext(ProductContractAPIContext)
  const { accounts } = useContext(ProfileContractContext)
  const { productContract } = useContext(ProductContractContext)

  const [sendProductData, setSendProductData] = useState<ISendProductDetails>(
    sendProductInitialState
  )
  const [isReceiverAddressFieldValid, setIsReceiverAddressFieldValid] =
    useState<boolean>(true)
  const [isLogisticsAddressFieldValid, setIsLogisticsAddressFieldValid] =
    useState<boolean>(true)
  const [isTrackNumberFieldValid, setIsTrackNumberFieldValid] =
    useState<boolean>(false)
  const [products, setProducts] = useState<ICreateProductPayload[]>([])
  const [productDetails, setProductDetails] = useState({
    productId: -1,
    productName: '',
    productLocation: '',
    farmDate: '',
    harvestDate: new Date(),
    processingType: new Date(),
  })
  const [showTable, setShowTable] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    const getProducts = async () => {
      const products = await getProductsByStatus(ProductStatus.MANUFACTURING)

      setProducts(products)
    }

    getProducts()
  }, [])

  const handleChangeSendProduct = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'productId') {
      const product = await getProductById(parseInt(value))

      setProductDetails(product)
      setShowTable(true)
      setError(false)
      setSuccess(false)
    }

    if (name === 'receiverAddress') {
      if (value === '') {
        setIsReceiverAddressFieldValid(false)
      } else {
        setIsReceiverAddressFieldValid(true)
      }
    }

    if (name === 'logisticsAddress') {
      if (value === '') {
        setIsLogisticsAddressFieldValid(false)
      } else {
        setIsLogisticsAddressFieldValid(true)
      }
    }

    if (name === 'trackNumber') {
      if (value === '') {
        setIsTrackNumberFieldValid(false)
      } else {
        setIsTrackNumberFieldValid(true)
      }
    }

    setSendProductData({ ...sendProductData, [name]: value })
  }

  const handleSubmissionSendProduct = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // ON-CHAIN INTERACTION
      const _accounts = await getAccounts(accounts)
      const sendProductResp = await productContract?.methods
        .sendProduct(
          sendProductData.productId,
          sendProductData.receiverAddress,
          sendProductData.logisticsAddress,
          sendProductData.trackNumber
        )
        .send({ from: _accounts[0] })

      if (sendProductResp) {
        // Get event
        const { productId, productStatus } =
          sendProductResp.events.CurrentProductStatus.returnValues
        const { receiverAddress, logisticsAddress, trackNumber } =
          sendProductData

        const apiPayload = {
          productId,
          productStatus,
          receiverAddress,
          logisticsAddress,
          trackNumber,
        }

        // API CALL
        await shippingProductInfo(apiPayload)

        // Do an API call to get update for the dropdown
        setTimeout(async () => {
          const products = await getProductsByStatus(
            ProductStatus.MANUFACTURING
          )
          setProducts(products)

          // Reset form state, stop loading spinner and hide table
          setSendProductData(sendProductInitialState)
          setIsLoading(false)
          setShowTable(false)
          setError(false)

          // show success message
          setSuccess(true)
        }, 1000)
      }
    } catch (e) {
      if (
        e.message.includes(
          'This function can only be executed by the manufacturer'
        )
      ) {
        setError(true)
        setErrorMessage(
          'This function can only be executed by the manufacturer. Please also ensure that your account has been approved by the regulator before proceeding.'
        )
        setIsLoading(false)
        setShowTable(false)
        setSuccess(false)
      } else if (e.message.includes('not the logistic address')) {
        setError(true)
        setErrorMessage('The logistics address you entered is invalid')
        setIsLoading(false)
        setShowTable(false)
        setSuccess(false)
      } else if (e.message.includes('not the retailer address')) {
        setError(true)
        setErrorMessage('The retailer address you entered is invalid')
        setIsLoading(false)
        setShowTable(false)
        setSuccess(false)
      } else {
        setError(true)
        setErrorMessage('Something went wrong. Please try again shortly.')
        setIsLoading(false)
        setShowTable(false)
        setSuccess(false)
        console.log(e.message)
      }
    }
  }
  return (
    <section className="container">
      {error ? (
        <div className="notification is-danger is-light">{errorMessage}</div>
      ) : null}

      {success ? (
        <div className="notification is-success is-light mb-5">
          <div>
            <strong>{productDetails.productName}</strong> of{' '}
            <strong>{productDetails.productLocation}</strong> has been shipped
            and successfully transferred to the retail process.
          </div>
        </div>
      ) : null}

      {showTable && (
        <div className="is-success is-light mb-5">
          <div className="title is-6">
            <strong>Product Information</strong>
          </div>

          <table className="table is-striped table-style">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Processing Type</th>
                <th>Farm Date</th>
                <th>Harvest Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{productDetails.productId}</td>
                <td>{productDetails.productName}</td>
                <td>{productDetails.productLocation}</td>
                <td>{productDetails.processingType}</td>
                <td>
                  {format(new Date(productDetails.farmDate), 'dd MMMM yyy')}
                </td>
                <td>
                  {format(new Date(productDetails.harvestDate), 'dd MMMM yyy')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="columns">
        <div className="column is-half">
          <img
            src={
              'https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
            }
            alt="farm"
            className="product-image"
          />
        </div>
        <div className="column is-half farmer-form has-background-white-bis">
          <div className="product-title">
            <div className="product-title">
              <h1 className="title is-4">Shipping Process</h1>
            </div>

            <form className="mt-5 shipping-form">
              <div className="field">
                <label className="label">Product ({products.length})</label>
                <div className="select is-normal is-fullwidth">
                  <select
                    name="productId"
                    id="productId"
                    onChange={handleChangeSendProduct}
                    value={sendProductData.productId}
                  >
                    <option value={'DEFAULT'} disabled>
                      Select Product
                    </option>
                    {products?.map((product: any, idx: number) => (
                      <option key={idx} value={product.productId}>
                        {product.productName} ({product.productLocation})
                      </option>
                    ))}

                    {!products.length && (
                      <option disabled>No Products To Process</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">Receiver Address</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="receiverAddress"
                    id="receiverAddress"
                    onChange={handleChangeSendProduct}
                    value={sendProductData.receiverAddress}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Logistics Address</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="logisticsAddress"
                    id="logisticsAddress"
                    onChange={handleChangeSendProduct}
                    value={sendProductData.logisticsAddress}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Track Number</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="trackNumber"
                    id="trackNumber"
                    onChange={handleChangeSendProduct}
                    value={sendProductData.trackNumber}
                  />
                </div>
              </div>

              <button
                className={
                  isLoading
                    ? 'button is-block is-link is-fullwidth mt-3 is-loading'
                    : 'button is-block is-link is-fullwidth mt-3'
                }
                disabled={
                  !isReceiverAddressFieldValid ||
                  !isLogisticsAddressFieldValid ||
                  !isTrackNumberFieldValid ||
                  sendProductData.productId === 'DEFAULT'
                }
                onClick={(e) => handleSubmissionSendProduct(e)}
              >
                Send
              </button>
              <br />
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Shipping
