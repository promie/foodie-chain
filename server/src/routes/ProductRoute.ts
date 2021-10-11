import express from 'express'
import { ProductController } from '../controllers'

const router = express.Router()

router.route('/').post(ProductController.createProduct)
router.route('/manu-info').patch(ProductController.manuProductInfo)
router.route('/shipping-info').patch(ProductController.shippingProductInfo)
router.route('/retailing-info').patch(ProductController.retailProductInfo)
router.route('/purchasing-info').patch(ProductController.purchasingProductInfo)
router
  .route('/status/:status')
  .get(ProductController.getProductsByStatus)
router.route('/id/:id').get(ProductController.getProductById)

router.route('/recall-product').post(ProductController.recallProduct)

export default router
