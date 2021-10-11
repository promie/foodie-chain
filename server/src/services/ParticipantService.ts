import { ParticipantRepository } from '../repositories'
import {
  IParticipant,
  ITransformedParticipant,
} from '../interfaces/participant'

const register = async (
  participantDetails: IParticipant
): Promise<ITransformedParticipant> => {
  const participant = await ParticipantRepository.register(participantDetails)

  return {
    accountAddress: participant.accountAddress,
    accountId: participant.accountId,
    accountName: participant.accountName,
    accountStatus: participant.accountStatus,
    accountType: participant.accountType,
  }
}

const isAccountAlreadyRegistered = async (
  accountAddress: string
): Promise<boolean> => {
  const account = await ParticipantRepository.isAccountAlreadyRegistered(
    accountAddress
  )

  return account !== null
}

const normaliseResponse = (
  results: IParticipant[]
): ITransformedParticipant[] => {
  return results.map((item: IParticipant) => {
    return {
      id: item._id,
      accountAddress: item.accountAddress,
      accountId: item.accountId,
      accountName: item.accountName,
      accountStatus: item.accountStatus,
      accountType: item.accountType,
    }
  })
}

const getParticipantsByStatus = async (
  accountStatus: string[] | string
): Promise<ITransformedParticipant[]> => {
  const participants = await ParticipantRepository.getParticipantsByStatus(
    accountStatus
  )

  return normaliseResponse(participants)
}

const getAllParticipants = async () => {
  const participants = await ParticipantRepository.getAllParticipants()

  return normaliseResponse(participants)
}

const updateAccountStatusByAddress = async (
  accountAddress: string,
  updatedStatus: number
): Promise<ITransformedParticipant> => {
  const updatedParticipant =
    await ParticipantRepository.updateAccountStatusByAddress(
      accountAddress,
      updatedStatus
    )

  return {
    accountAddress: updatedParticipant.accountAddress,
    accountId: updatedParticipant.accountId,
    accountName: updatedParticipant.accountName,
    accountStatus: updatedParticipant.accountStatus,
    accountType: updatedParticipant.accountType,
  }
}

const getAccountTypeByAddress = (address: string) => {
  return ParticipantRepository.getAccountTypeByAddress(address)
}

export default {
  register,
  isAccountAlreadyRegistered,
  getParticipantsByStatus,
  getAllParticipants,
  updateAccountStatusByAddress,
  getAccountTypeByAddress,
}
