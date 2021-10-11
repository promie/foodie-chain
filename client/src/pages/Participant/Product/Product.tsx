import React, { FC, useState } from 'react'
import { ProductStatus } from '../../../enums/contract'
import Farmer from '../../../components/Farmer'
import Manufacturer from '../../../components/Manufacturer'
// @ts-ignore
import Shipping from '../../../components/Shipping'
import Retail from '../../../components/Retail'
import Purchase from '../../../components/Purchase'

const Product: FC = () => {
  const [farmerActiveClass, setFarmerActiveClass] =
    useState<string>('is-active')
  const [manufacturerActiveClass, setManufacturerActiveClass] =
    useState<string>('')
  const [shippingActiveClass, setShippingActiveClass] = useState<string>('')
  const [retailActiveClass, setRetailActiveClass] = useState<string>('')
  const [purchaseActiveClass, setPurchaseActiveClass] = useState<string>('')

  const switchTab = (productCategory: number) => {
    switch (productCategory) {
      case ProductStatus.FARMING:
        setFarmerActiveClass('is-active')
        setManufacturerActiveClass('')
        setRetailActiveClass('')
        setPurchaseActiveClass('')
        setShippingActiveClass('')
        break
      case ProductStatus.MANUFACTURING:
        setManufacturerActiveClass('is-active')
        setFarmerActiveClass('')
        setRetailActiveClass('')
        setPurchaseActiveClass('')
        setShippingActiveClass('')
        break
      case ProductStatus.SHIPPING:
        setPurchaseActiveClass('')
        setRetailActiveClass('')
        setManufacturerActiveClass('')
        setFarmerActiveClass('')
        setShippingActiveClass('is-active')
        break
      case ProductStatus.RETAILING:
        setRetailActiveClass('is-active')
        setManufacturerActiveClass('')
        setFarmerActiveClass('')
        setPurchaseActiveClass('')
        setShippingActiveClass('')
        break
      case ProductStatus.PURCHASING:
        setPurchaseActiveClass('is-active')
        setRetailActiveClass('')
        setManufacturerActiveClass('')
        setFarmerActiveClass('')
        setShippingActiveClass('')
        break
      default:
        break
    }
  }

  return (
    <>
      <div className="tabs is-centered is-boxed">
        <ul>
          <li
            className={farmerActiveClass}
            onClick={() => switchTab(ProductStatus.FARMING)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-seedling" aria-hidden="true" />
              </span>
              <span>Farmer</span>
            </a>
          </li>
          <li
            className={manufacturerActiveClass}
            onClick={() => switchTab(ProductStatus.MANUFACTURING)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-industry" aria-hidden="true" />
              </span>
              <span>Manufacturer</span>
            </a>
          </li>

          <li
            className={shippingActiveClass}
            onClick={() => switchTab(ProductStatus.SHIPPING)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-ship" aria-hidden="true" />
              </span>
              <span>Shipping</span>
            </a>
          </li>

          <li
            className={retailActiveClass}
            onClick={() => switchTab(ProductStatus.RETAILING)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-store-alt" aria-hidden="true" />
              </span>
              <span>Retail</span>
            </a>
          </li>
          <li
            className={purchaseActiveClass}
            onClick={() => switchTab(ProductStatus.PURCHASING)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-credit-card" aria-hidden="true" />
              </span>
              <span>Purchase</span>
            </a>
          </li>
        </ul>
      </div>

      {farmerActiveClass && <Farmer />}
      {manufacturerActiveClass && <Manufacturer />}
      {shippingActiveClass && <Shipping />}
      {retailActiveClass && <Retail />}
      {purchaseActiveClass && <Purchase />}
    </>
  )
}

export default Product
