import { ProductModel } from '../models'
import { IProduct } from '../interfaces/product'
import { ProductStatus } from '../enums/productContract'

const createProduct = (productDetails: IProduct): Promise<IProduct> => {
  return ProductModel.create(productDetails)
}

const manuProductInfo = (productDetails: any) => {
  return ProductModel.findOneAndUpdate(
    {
      productId: productDetails.productId,
    },
    {
      $set: {
        processingType: productDetails.processingType,
        status: productDetails.status,
      },
    },
    {
      new: true,
    }
  )
}

const shippingProductInfo = async (productDetails: any) => {
  return ProductModel.findOneAndUpdate(
    {
      productId: productDetails.productId,
    },
    {
      $set: {
        receiverAddress: productDetails.receiverAddress,
        logisticsAddress: productDetails.logisticsAddress,
        trackNumber: productDetails.trackNumber,
        status: productDetails.status,
      },
    },
    {
      new: true,
    }
  )
}

const retailProductInfo = (productDetails: any) => {
  return ProductModel.findOneAndUpdate(
    {
      productId: productDetails.productId,
    },
    {
      $set: {
        status: productDetails.status,
      },
    },
    {
      new: true,
    }
  )
}

const purchasingProductInfo = (
  productDetails: any
) => {
  return ProductModel.findOneAndUpdate(
    {
      productId: productDetails.productId,
    },
    {
      $set: {
        status: productDetails.status,
        price: productDetails.price,
      },
    },
    {
      new: true,
    }
  )
}

const getProductsByStatus = (productStatus: number) => {
  return ProductModel.find({
    status: productStatus,
  })
}

const getProductById = (productId: number) => {
  return ProductModel.find({ productId })
}

const recallProduct = async (productId: number) => {
  const product = await ProductModel.findOne({ productId: { $exists: true, $eq: productId } }).exec();

  if (product === null || product.status == ProductStatus.RECALLING)
    return false;

  product.status = ProductStatus.RECALLING;
  await product.save();

  return true;
}

export default {
  createProduct,
  retailProductInfo,
  purchasingProductInfo,
  manuProductInfo,
  shippingProductInfo,
  getProductsByStatus,
  getProductById,
  recallProduct,
}
