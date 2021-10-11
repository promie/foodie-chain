import React, { FC, createContext, useState, useEffect } from 'react'
import api from '../../api'
import {
  IProfileContractAPI,
  IParticipantDetails,
} from '../../interfaces/contract'
import { AccountStatus } from '../../enums/contract'

const contextDefaultValues: IProfileContractAPI = {
  registerParticipant: () => {},
  registeredAccounts: [],
  registrationError: false,
  pendingAccounts: [],
  approvedAccounts: [],
  rejectedAccounts: [],
  updateAccountStatus: () => {},
  getAllParticipants: () => {},
}

export const ProfileContractAPIContext =
  createContext<IProfileContractAPI>(contextDefaultValues)

const ProfileContractAPIProvider: FC = ({ children }): any => {
  const [registrationError, setRegistrationError] = useState<boolean>(false)
  const [registeredAccounts, setRegisteredAccounts] = useState<
    IParticipantDetails[]
  >([])
  const [pendingAccounts, setPendingAccounts] = useState<IParticipantDetails[]>(
    []
  )
  const [approvedAccounts, setApprovedAccounts] = useState<
    IParticipantDetails[]
  >([])
  const [rejectedAccounts, setRejectedAccounts] = useState<
    IParticipantDetails[]
  >([])

  useEffect(() => {
    getAllParticipants()
  }, [])

  const registerParticipant = async (
    participantDetails: IParticipantDetails
  ) => {
    try {
      Promise.all([
        await api.post('/v1/participants/register', participantDetails),
        await getAllParticipants(),
      ])

      setRegistrationError(false)
    } catch (err) {
      setRegistrationError(true)
    }
  }

  const getAllParticipants = async () => {
    await getParticipantsByStatus(AccountStatus.PENDING)
    await getParticipantsByStatus(AccountStatus.APPROVED)
    await getParticipantsByStatus(AccountStatus.REJECTED)
  }

  const getParticipantsByStatus = async (accountStatus: number) => {
    try {
      const resp = await api.get(
        `/v1/participants/status?accountStatus=${accountStatus}`
      )

      switch (accountStatus) {
        case AccountStatus.PENDING:
          setPendingAccounts(resp.data.participants)
          setRegisteredAccounts([
            ...pendingAccounts,
            ...rejectedAccounts,
            ...approvedAccounts,
          ])
          break
        case AccountStatus.APPROVED:
          setApprovedAccounts(resp.data.participants)
          setRegisteredAccounts([
            ...pendingAccounts,
            ...rejectedAccounts,
            ...approvedAccounts,
          ])
          break
        case AccountStatus.REJECTED:
          setRejectedAccounts(resp.data.participants)
          setRegisteredAccounts([
            ...pendingAccounts,
            ...rejectedAccounts,
            ...approvedAccounts,
          ])
          break
        default:
          break
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateAccountStatus = async (
    address: string,
    updatedAccountStatus: number
  ) => {
    try {
      const resp = await api.patch(`/v1/participants/${address}`, {
        accountStatus: updatedAccountStatus,
      })

      switch (updatedAccountStatus) {
        case AccountStatus.PENDING:
          setPendingAccounts(resp.data.participants)
          break
        case AccountStatus.APPROVED:
          setApprovedAccounts(resp.data.participants)
          break
        case AccountStatus.REJECTED:
          setRejectedAccounts(resp.data.participants)
          break
        default:
          break
      }

      getAllParticipants()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ProfileContractAPIContext.Provider
      value={{
        registerParticipant,
        registeredAccounts,
        registrationError,
        pendingAccounts,
        approvedAccounts,
        rejectedAccounts,
        updateAccountStatus,
        getAllParticipants,
      }}
    >
      {children}
    </ProfileContractAPIContext.Provider>
  )
}

export default ProfileContractAPIProvider
