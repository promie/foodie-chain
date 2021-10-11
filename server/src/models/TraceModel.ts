import { Model, model, Schema } from 'mongoose'
import { IProductLocation } from "../interfaces/trace";

interface ProductTracking {
    blockNumber: number;
    trackerAddress: string;
    productId: number;
    trackingNumber: string;
    tick?: number;
}

interface ProductLocationRequest {
    productId: number;
    blockNumber: number;
    isResponded: Boolean;
}

const productTrackingSchema = new Schema<ProductTracking>({
    blockNumber: { type: Number, required: true },
    trackerAddress: { type: String, required: true },
    productId: { type: Number, required: true },
    trackingNumber: { type: String, required: true },
    tick: { type: Number, required: false },
});

const productLocationRequestSchema = new Schema<ProductLocationRequest>({
    productId: { type: Number, required: true },
    blockNumber: { type: Number, required: true },
    isResponded: { type: Number, required: true },
});

const productLocationSchema = new Schema<IProductLocation>({
    blockNumber: { type: Number, required: true },
    productId: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

const ProductTrackingModel = model<ProductTracking>('ProductTracking', productTrackingSchema);
const ProductLocationRequestModel = model<ProductLocationRequest>('ProductLocationRequest', productLocationRequestSchema);
const ProductLocationModel = model<IProductLocation>('ProductLocation', productLocationSchema);

export {
    ProductTrackingModel,
    ProductLocationRequestModel,
    ProductLocationModel,
}
