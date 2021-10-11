import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../services'
import httpStatus = require('http-status')
import { catchAsync } from '../utils'

const createProduct = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const product = await ProductService.createProduct(req.body)
    return res.status(httpStatus.CREATED).json({
      success: true,
      product,
    })
  }
)

const manuProductInfo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const product = await ProductService.manuProductInfo(req.body)

    return res.status(httpStatus.OK).json({
      success: true,
      product,
    })
  }
)

const shippingProductInfo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const product = await ProductService.shippingProductInfo(req.body)

    return res.status(httpStatus.OK).json({
      success: true,
      product,
    })
  }
)

const retailProductInfo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const product = await ProductService.retailProductInfo(req.body)
    return res.status(httpStatus.OK).json({
      success: true,
      product,
    })
  }
)

const purchasingProductInfo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const product = await ProductService.purchasingProductInfo(req.body)
    return res.status(httpStatus.OK).json({
      success: true,
      product,
    })
  }
)

const getProductsByStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const products = await ProductService.getProductsByStatus(
      parseInt(req.params.status)
    )
    return res.status(httpStatus.OK).json({
      success: true,
      products,
    })
  }
)

const getProductById = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {

    const product = await ProductService.getProductById(parseInt(req.params.id))
    return res.status(httpStatus.OK).json({
      success: true,
      product,
    })
  }
)

const recallProduct = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { productId: productId } = req.body

    const result = await ProductService.recallProduct(productId)

    return res.status(httpStatus.OK).json({
      success: true,
      result,
    })
  }
)

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
