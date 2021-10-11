import { TraceRepository } from '../repositories'
import { IProductLocation } from '../interfaces/trace'

async function getProductLocationLogs( productId: number ): Promise<IProductLocation[]> {
    const logs = await TraceRepository.queryLocationForProduct( productId );

    return logs.map( (x)=> ({
        productId: x.productId,
        timestamp: x.timestamp,
        blockNumber: x.blockNumber,
        latitude: x.latitude/100000,
        longitude: x.longitude/100000,
    }) );
}

export default { getProductLocationLogs }
