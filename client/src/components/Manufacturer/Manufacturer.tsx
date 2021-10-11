import React, { ChangeEvent, FC, useState, useContext, useEffect } from 'react'
import format from 'date-fns/format'
import './manufacturer.css'
import {
  ICreateProductPayload,
  IManufacturerProcessDetails,
} from '../../interfaces/contract'
import { ProductContractAPIContext } from '../../contexts/ProductContractAPI'
import { ProductStatus } from '../../enums/contract'
import { ProfileContractContext } from '../../contexts/ProfileContract'
import { ProductContractContext } from '../../contexts/ProductContract'
import getAccounts from '../../utils/getAccounts'

const initialState: IManufacturerProcessDetails = {
  productId: 'DEFAULT',
  processingType: '',
}

const Manufacturer: FC = () => {
  const { getProductsByStatus, getProductById, manuProductInfo } = useContext(
    ProductContractAPIContext
  )

  const { accounts } = useContext(ProfileContractContext)
  const { productContract } = useContext(ProductContractContext)

  const [data, setData] = useState<IManufacturerProcessDetails>(initialState)
  const [isProcessingTypeFieldValid, setIsProcessingTypeFieldValid] =
    useState<boolean>(false)
  const [products, setProducts] = useState<ICreateProductPayload[]>([])
  const [productDetails, setProductDetails] = useState({
    productId: -1,
    productName: '',
    productLocation: '',
    farmDate: new Date(),
    harvestDate: new Date(),
  })
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [showTable, setShowTable] = useState<boolean>(false)
  const [isManufacturingLoading, setIsManufacturingLoading] =
    useState<boolean>(false)

  useEffect(() => {
    const getProducts = async () => {
      const products = await getProductsByStatus(ProductStatus.FARMING)

      setProducts(products)
    }

    getProducts()
  }, [])

  const handleChange = async (
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

    if (name === 'processingType') {
      if (value === '') {
        setIsProcessingTypeFieldValid(false)
      } else {
        setIsProcessingTypeFieldValid(true)
      }
    }

    setData({ ...data, [name]: value })
  }

  const handleSubmission = async (e: any) => {
    e.preventDefault()
    setIsManufacturingLoading(true)

    try {
      // ON-CHAIN INTERACTION
      const _accounts = await getAccounts(accounts)
      const manuProductResp = await productContract?.methods
        .manuProductInfo(data.productId, data.processingType)
        .send({ from: _accounts[0] })

      if (manuProductResp) {
        // Get event
        const { productId, productStatus } =
          manuProductResp.events.CurrentProductStatus.returnValues
        const { processingType } = data

        const apiPayload = {
          productId,
          processingType,
          productStatus,
        }

        // API CALL
        await manuProductInfo(apiPayload)

        // Do an API call to get update for the dropdown
        setTimeout(async () => {
          // Resetting the dropdown selection to exclude selection
          const products = await getProductsByStatus(ProductStatus.FARMING)
          setProducts(products)

          // Reset form state, stop loading spinner,hide table and hide error
          setData(initialState)
          setIsManufacturingLoading(false)
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
        setIsManufacturingLoading(false)
        setShowTable(false)
        setSuccess(false)
      } else {
        setIsManufacturingLoading(false)
        setError(true)
        setErrorMessage('Something went wrong. Please try again shortly.')
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
            and successfully transferred to the shipping process.
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
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="columns">
        <div className="column is-half">
          <img
            src={
              'https://images.unsplash.com/photo-1518253042715-a2534e1b0a7b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80'
            }
            alt="farm"
            className="product-image"
          />
        </div>
        <div className="column is-half farmer-form has-background-white-bis">
          <>
            <div className="product-title mt-6">
              <h1 className="title is-4">Manufacturer Process</h1>
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

              <div className="field">
                <label className="label">Processing Type</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="processingType"
                    id="processingType"
                    onChange={handleChange}
                    value={data.processingType}
                  />
                </div>
              </div>

              <button
                className={
                  isManufacturingLoading
                    ? 'button is-block is-link is-fullwidth mt-3 is-loading'
                    : 'button is-block is-link is-fullwidth mt-3'
                }
                disabled={
                  !isProcessingTypeFieldValid || data.productId === 'DEFAULT'
                }
                onClick={(e) => handleSubmission(e)}
              >
                Add
              </button>
              <br />
            </form>
          </>
        </div>
      </div>
    </section>
  )
}

export default Manufacturer
