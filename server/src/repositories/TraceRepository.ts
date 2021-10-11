import { ProductLocationModel } from '../models/TraceModel'
import { IProductLocation } from '../interfaces/trace';


// const register = (participantDetails: IParticipant): Promise<IParticipant> => {
//   return ParticipantModel.create(participantDetails)
// }

// const isAccountAlreadyRegistered = async (
//   accountAddress: string
// ): Promise<IParticipant | null> => {
//   const entry = await ParticipantModel.findOne({
//     accountAddress: accountAddress,
//   })

//   return entry
// }

async function queryLocationForProduct(productId: number): Promise<IProductLocation[]> {
    return await ProductLocationModel
                    .find({ productId: productId })
                    .sort({ blockNumber: 1 });
}

export default { queryLocationForProduct }