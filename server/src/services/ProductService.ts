import { ProductRepository } from '../repositories'
import { IProduct } from '../interfaces/product'
import { ProductStatus } from '../enums/productContract'

const createProduct = (productDetails: IProduct) => {
  return ProductRepository.createProduct(productDetails)
}

const manuProductInfo = (productDetails: IProduct) => {
  const newProductDetails = {
    ...productDetails,
    status: ProductStatus.MANUFACTURING,
  }

  return ProductRepository.manuProductInfo(newProductDetails)
}

const shippingProductInfo = (productDetails: IProduct) => {
  const newProductDetails = {
    ...productDetails,
    status: ProductStatus.SHIPPING,
  }

  return ProductRepository.shippingProductInfo(newProductDetails)
}

const retailProductInfo = async (productDetails: IProduct) => {
  const newProductDetails = {
    ...productDetails,
    status: ProductStatus.RETAILING,
  }

  return ProductRepository.retailProductInfo(newProductDetails)
}

const purchasingProductInfo = (productDetails: IProduct) => {
  const newProductDetails = {
    ...productDetails,
    status: ProductStatus.PURCHASING,
  }

  return ProductRepository.purchasingProductInfo(newProductDetails)
}

const getProductsByStatus = (productStatus: number) => {
  return ProductRepository.getProductsByStatus(productStatus)
}

const getProductById = (productId: number) => {
  return ProductRepository.getProductById(productId)
}

const recallProduct = async(productId: number) => {
  const result = await ProductRepository.recallProduct(productId)

  return result
}

export default {
  createProduct,
  manuProductInfo,
  shippingProductInfo,
  retailProductInfo,
  purchasingProductInfo,
  getProductsByStatus,
  getProductById,
  recallProduct,
}
