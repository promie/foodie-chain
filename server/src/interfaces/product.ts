import { Document } from 'mongoose'
import { ProductStatus } from '../enums/productContract'

export interface IProduct extends Document {
  productId?: number
  productName?: string
  productLocation?: string
  farmDate?: Date
  harvestDate?: Date
  processingType?: string
  timestamp?: Date
  price?: number
  status?: ProductStatus
}
