import { Request, Response, NextFunction } from 'express'
import { ParticipantService } from '../services'
import httpStatus = require('http-status')
import { catchAsync } from '../utils'

const register = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { accountAddress } = req.body

    const alreadyRegistered =
      await ParticipantService.isAccountAlreadyRegistered(accountAddress)

    if (alreadyRegistered) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'This account address is already registered.',
      })
    }

    const participantDetails = await ParticipantService.register(req.body)

    return res.status(httpStatus.CREATED).json({
      success: true,
      participantDetails,
    })
  }
)

const getParticipantsByStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const accountStatuses: string[] | string =
      (Object.values(req.query)[0] as string[] | string) || []

    const participants = await ParticipantService.getParticipantsByStatus(
      accountStatuses
    )

    return res.status(httpStatus.OK).json({
      success: true,
      participants,
    })
  }
)

const getAllParticipants = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const participants = await ParticipantService.getAllParticipants()

    return res.status(httpStatus.OK).json({
      success: true,
      participants,
    })
  }
)

const updateAccountStatusByAddress = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { address: accountAddress } = req.params
    const { accountStatus: updatedStatus } = req.body
    const participants = await ParticipantService.updateAccountStatusByAddress(
      accountAddress,
      parseInt(updatedStatus)
    )

    return res.status(httpStatus.OK).json({
      success: true,
      participants,
    })
  }
)

// getAccountTypeByAddress
const getAccountTypeByAddress = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { address: accountAddress } = req.params

    const participant = await ParticipantService.getAccountTypeByAddress(
      accountAddress
    )

    return res.status(httpStatus.OK).json({
      success: true,
      participant,
    })
  }
)

export default {
  register,
  getParticipantsByStatus,
  getAllParticipants,
  updateAccountStatusByAddress,
  getAccountTypeByAddress,
}
