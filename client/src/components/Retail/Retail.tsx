import React, { ChangeEvent, FC, useState, useContext, useEffect } from 'react'
import format from 'date-fns/format'
import ReactTooltip from 'react-tooltip'
import './retail.css'
import {
  ICreateProductPayload,
  IRetailProcessDetails,
} from '../../interfaces/contract'
import { ProductContractAPIContext } from '../../contexts/ProductContractAPI'
import { ProfileContractContext } from '../../contexts/ProfileContract'
import { ProductContractContext } from '../../contexts/ProductContract'
import getAccounts from '../../utils/getAccounts'
import { ProductStatus } from '../../enums/contract'
import { shortenedAddress } from '../../helpers/stringMutations'

const initialState: IRetailProcessDetails = {
  productId: 'DEFAULT',
}

const Retail: FC = () => {
  const { getProductsByStatus, getProductById, retailProductInfo } = useContext(
    ProductContractAPIContext
  )

  const { accounts } = useContext(ProfileContractContext)
  const { productContract } = useContext(ProductContractContext)

  const [data, setData] = useState<IRetailProcessDetails>(initialState)
  const [products, setProducts] = useState<ICreateProductPayload[]>([])
  const [productDetails, setProductDetails] = useState({
    productId: -1,
    productName: '',
    productLocation: '',
    farmDate: new Date(),
    harvestDate: new Date(),
    processingType: '',
    logisticsAddress: '',
    trackNumber: '',
  })
  const [showTable, setShowTable] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    const getProducts = async () => {
      const products = await getProductsByStatus(ProductStatus.SHIPPING)

      setProducts(products)
    }

    getProducts()
  }, [])

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'productId') {
      const product = await getProductById(parseInt(value))

      setProductDetails(product)
      setShowTable(true)
      setError(false)
      setSuccess(false)
    }

    setData({ ...data, [name]: value })
  }

  const handleSubmission = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // ON-CHAIN INTERACTION
      const _accounts = await getAccounts(accounts)
      const retailProductResp = await productContract?.methods
        .retailProductInfo(data.productId)
        .send({ from: _accounts[0] })

      if (retailProductResp) {
        // Get event
        const { productId, productStatus } =
          retailProductResp.events.CurrentProductStatus.returnValues

        const apiPayload = {
          productId,
          productStatus,
        }

        // API CALL
        await retailProductInfo(apiPayload)

        // Do an API call to get update for the dropdown
        setTimeout(async () => {
          // Resetting the dropdown selection to exclude selection
          const products = await getProductsByStatus(ProductStatus.SHIPPING)
          setProducts(products)

          // Reset form state, stop loading spinner and hide table
          setData(initialState)
          setIsLoading(false)
          setShowTable(false)
          setError(false)

          // show success message
          setSuccess(true)
        }, 1000)
      }
    } catch (e) {
      if (
        e.message.includes('This function can only be executed by the retailer')
      ) {
        setError(true)
        setErrorMessage(
          'This function can only be executed by the retailer. Please also ensure that your account has been approved by the regulator before proceeding.'
        )
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
            <strong>{productDetails.productLocation}</strong> has been processed
            and successfully transferred to the purchase process.
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
                <th>Farm Date</th>
                <th>Harvest Date</th>
                <th>Processing Type</th>
                <th>Logistics Address</th>
                <th>Track Number</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{productDetails.productId}</td>
                <td>{productDetails.productName}</td>
                <td>{productDetails.productLocation}</td>
                <td>
                  {format(new Date(productDetails.farmDate), 'dd MMMM yyy')}
                </td>
                <td>
                  {format(new Date(productDetails.harvestDate), 'dd MMMM yyy')}
                </td>
                <td>{productDetails.processingType}</td>
                <td data-tip={productDetails.logisticsAddress}>
                  {productDetails.logisticsAddress.length > 20
                    ? shortenedAddress(productDetails.logisticsAddress)
                    : productDetails.logisticsAddress}
                  <ReactTooltip />
                </td>
                <td>{productDetails.trackNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="columns">
        <div className="column is-half">
          <img
            src={
              'https://images.unsplash.com/photo-1601647998384-a6e5b618e8f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=705&q=80'
            }
            alt="farm"
            className="product-image"
          />
        </div>
        <div className="column is-half retail-form has-background-white-bis">
          <div className="product-title">
            <h1 className="title is-4">Retail Process</h1>
          </div>
          <form className="mt-5">
            <div className="field">
              <label className="label">Product ({products.length})</label>
              <div className="select is-normal is-fullwidth">
                <select
                  name="productId"
                  id="productId"
                  onChange={handleChange}
                  value={data.productId}
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
            <button
              className={
                isLoading
                  ? 'button is-block is-link is-fullwidth mt-3 is-loading'
                  : 'button is-block is-link is-fullwidth mt-3'
              }
              disabled={data.productId === 'DEFAULT'}
              onClick={(e) => handleSubmission(e)}
            >
              Submit
            </button>
            <br />
          </form>
        </div>
      </div>
    </section>
  )
}

export default Retail
