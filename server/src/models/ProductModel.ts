import { IProduct } from '../interfaces/product'
import { Model, model, Schema } from 'mongoose'
import { ProductStatus } from '../enums/productContract'

const ProductSchema: Schema = new Schema(
  {
    productId: {
      type: Number,
      default: '',
    },
    productName: {
      type: String,
      default: '',
    },
    productLocation: {
      type: String,
      default: '',
    },
    farmDate: {
      type: Date,
      default: '',
    },
    harvestDate: {
      type: Date,
      default: '',
    },
    processingType: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: '',
    },
    receiverAddress: {
      type: String,
      default: ''
    },
    logisticsAddress: {
      type: String,
      default: ''
    },
    trackNumber: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      enum: Object.values(ProductStatus),
      default: ProductStatus.FARMING,
    },
  },
  { timestamps: true }
)

const Product: Model<IProduct> = model('Product', ProductSchema)

export default Product
