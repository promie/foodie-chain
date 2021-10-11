import { Document } from 'mongoose'

export interface IProductLocation {
    blockNumber: number;
    productId: number;
    timestamp: number;
    latitude: number;
    longitude: number;
}