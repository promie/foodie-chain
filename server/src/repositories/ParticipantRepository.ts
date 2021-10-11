import { ParticipantModel } from '../models'
import { IParticipant } from '../interfaces/participant'

const register = (participantDetails: IParticipant): Promise<IParticipant> => {
  return ParticipantModel.create(participantDetails)
}

const isAccountAlreadyRegistered = async (
  accountAddress: string
): Promise<IParticipant | null> => {
  const entry = await ParticipantModel.findOne({
    accountAddress: accountAddress,
  })

  return entry
}

const getParticipantsByStatus = (
  accountStatuses: string[] | string
): Promise<IParticipant[]> => {
  // @ts-ignore
  return ParticipantModel.find({
    accountStatus: { $in: accountStatuses },
  }).exec()
}

const getAllParticipants = () => {
  return ParticipantModel.find({}).exec()
}

const updateAccountStatusByAddress = async (
  accountAddress: string,
  updatedStatus: number
): Promise<IParticipant> => {
  // @ts-ignore
  return ParticipantModel.findOneAndUpdate(
    {
      accountAddress: accountAddress,
    },
    {
      $set: {
        accountStatus: updatedStatus,
      },
    },
    {
      new: true,
    }
  )
}

const getAccountTypeByAddress = (address: string) => {
  return ParticipantModel.find({ accountAddress: address })
}

export default {
  register,
  isAccountAlreadyRegistered,
  getParticipantsByStatus,
  getAllParticipants,
  updateAccountStatusByAddress,
  getAccountTypeByAddress,
}
