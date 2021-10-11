import React, { ChangeEvent, FC, useEffect, useState, useContext } from 'react'
import getUnixTime from 'date-fns/getUnixTime'
import 'bulma-calendar/dist/css/bulma-calendar.min.css'
// @ts-ignore
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js'
import './farmer.css'
import {
  ICreateProductPayload,
  IFarmerProductDetails,
  IFarmerProductInitial,
} from '../../interfaces/contract'
import { ProfileContractContext } from '../../contexts/ProfileContract'
import { ProductContractContext } from '../../contexts/ProductContract'
import { ProductContractAPIContext } from '../../contexts/ProductContractAPI'
import getAccounts from '../../utils/getAccounts'
import { ProductStatus } from '../../enums/contract'

const initialState: IFarmerProductInitial = {
  productName: '',
  productLocation: '',
}

const Farmer: FC = () => {
  const { accounts } = useContext(ProfileContractContext)
  const { productContract } = useContext(ProductContractContext)
  const { createProduct } = useContext(ProductContractAPIContext)

  const [data, setData] = useState<IFarmerProductInitial>(initialState)
  const [farmDate, setFarmDate] = useState<string>('')
  const [harvestDate, setHarvestDate] = useState<string>('')
  const [isProductNameFieldValid, setIsProductNameFieldValid] =
    useState<boolean>(false)
  const [isProductLocationFieldValid, setIsProductLocationFieldValid] =
    useState<boolean>(false)
  const [isFarmDateFieldValid, setIsFarmDateFieldValid] =
    useState<boolean>(false)
  const [isHarvestDateFieldValid, setIsHarvestDateFieldValid] =
    useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [successProductDetails, setSuccessProductDetails] =
    useState<ICreateProductPayload>({
      productId: -1,
      productName: '',
      productLocation: '',
      farmDate: '',
      harvestDate: '',
      status: -1,
    })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const calendars = bulmaCalendar.attach('[type="date"]', {})
    calendars.forEach((calendar: any) => {
      calendar.on('date:selected', (date: any) => {
        console.log(date)
      })
    })

    const farmDate = document.querySelector('#farmDate')
    if (farmDate) {
      // @ts-ignore
      farmDate.bulmaCalendar.on('select', (datepicker) => {
        setFarmDate(datepicker.data.value())
        setIsFarmDateFieldValid(true)
      })

      // @ts-ignore
      farmDate.bulmaCalendar.on('clear', (_datepicker) => {
        setFarmDate('')
        setIsFarmDateFieldValid(false)
      })
    }

    const harvestDate = document.querySelector('#harvestDate')
    if (harvestDate) {
      // @ts-ignore
      harvestDate.bulmaCalendar.on('select', (datepicker) => {
        setHarvestDate(datepicker.data.value())
        setIsHarvestDateFieldValid(true)
      })

      // @ts-ignore
      harvestDate.bulmaCalendar.on('clear', (_datepicker) => {
        setHarvestDate('')
        setIsHarvestDateFieldValid(false)
      })
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'productName') {
      if (value === '') {
        setIsProductNameFieldValid(false)
      } else {
        setIsProductNameFieldValid(true)
      }
    }

    if (name === 'productLocation') {
      if (value === '') {
        setIsProductLocationFieldValid(false)
      } else {
        setIsProductLocationFieldValid(true)
      }
    }

    setData({ ...data, [name]: value })
  }

  const handleAddProduct = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const payload: IFarmerProductDetails = {
      ...data,
      farmDate,
      harvestDate,
    }

    const farmDateType = new Date(payload.farmDate)
    const harvestDateType = new Date(payload.harvestDate)
    const farmDateEpoch = getUnixTime(farmDateType)
    const harvestDateEpoch = getUnixTime(harvestDateType)

    if (harvestDateType < farmDateType) {
      setError(true)
      setErrorMessage(
        'Harvest date cannot be before farm date. Please select a different date.'
      )
      setIsLoading(false)
      return
    }

    try {
      // Call createProduct on the product contract
      const _accounts = await getAccounts(accounts)
      const createProductResp = await productContract?.methods
        .createProduct(
          payload.productName,
          farmDateEpoch,
          harvestDateEpoch,
          payload.productLocation
        )
        .send({ from: _accounts[0] })

      if (createProductResp) {
        const { productId, productStatus } =
          createProductResp.events.CurrentProductStatus.returnValues

        const productName = payload.productName

        const productLocation = payload.productLocation

        const apiPayload = {
          productId,
          productName,
          productLocation,
          farmDate: farmDateType,
          harvestDate: harvestDateType,
          productStatus,
        }

        const product = await createProduct(apiPayload)

        // Set Success Message and set product object
        setSuccess(true)
        setSuccessProductDetails(product)

        setData(initialState)

        // Unset the error message if any and loading state back to false
        setError(false)
        setErrorMessage('')
        setIsLoading(false)
      }
    } catch (e) {
      if (
        e.message.includes('This function can only be executed by the farmer')
      ) {
        setError(true)
        setErrorMessage(
          'This function can only be executed by the farmer. Please also ensure that your account has been approved by the regulator before proceeding.'
        )
        setIsLoading(false)
        setSuccess(false)
      } else {
        setError(true)
        setErrorMessage('Something went wrong. Please try again shortly.')
        setIsLoading(false)
        setSuccess(false)
        console.log(e.message)
      }
    }
  }

  return (
    <section className="container">
      {error && !success ? (
        <div className="notification is-danger is-light">{errorMessage}</div>
      ) : null}

      {success && !error ? (
        <div className="notification is-success is-light mb-5">
          <div>
            <strong>{successProductDetails.productName}</strong> of{' '}
            <strong>{successProductDetails.productLocation}</strong> has been
            created and successfully transferred to the manufacturing process.
          </div>
        </div>
      ) : null}

      <div className="columns">
        <div className="column is-half">
          <img
            src={
              'https://images.unsplash.com/photo-1489657780376-e0d8630c4bd3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            }
            alt="farm"
            className="product-image"
          />
        </div>
        <div className="column is-half farmer-form has-background-white-bis">
          <div className="product-title">
            <h1 className="title is-4">Add Product</h1>
          </div>
          <form className="mt-5">
            <div className="field">
              <label className="label">Product Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="productName"
                  id="productName"
                  onChange={handleChange}
                  value={data.productName}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Product Location</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="productLocation"
                  id="productLocation"
                  onChange={handleChange}
                  value={data.productLocation}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Farm Date</label>
              <div className="control">
                <input
                  className="input"
                  type="date"
                  name="farmDate"
                  id="farmDate"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Harvest Date</label>
              <div className="control">
                <input
                  className="input"
                  type="date"
                  name="harvestDate"
                  id="harvestDate"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className={
                isLoading
                  ? 'button is-block is-link is-fullwidth mt-3 is-loading'
                  : 'button is-block is-link is-fullwidth mt-3'
              }
              onClick={(e) => handleAddProduct(e)}
              disabled={
                !isProductNameFieldValid ||
                !isProductLocationFieldValid ||
                !isFarmDateFieldValid ||
                !isHarvestDateFieldValid
              }
            >
              Add
            </button>
            <br />
          </form>
        </div>
      </div>
    </section>
  )
}

export default Farmer
