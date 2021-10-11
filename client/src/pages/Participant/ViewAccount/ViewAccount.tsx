import React, { FC, ChangeEvent, useState, useContext, useEffect } from 'react'
import ProfileTrackingImage from '../../../assets/database.png'
import { ProfileContractContext } from '../../../contexts/ProfileContract'
import { ProfileContractAPIContext } from '../../../contexts/ProfileContractAPI'
import ViewAccountForm from '../../../components/ViewAccountForm'
import ViewAccountStatus from '../../../components/ViewAccountStatus'
import './viewaccount.css'
import {
  IViewAccountDetails,
  IAccountStatus,
} from '../../../interfaces/contract'

const initialState: IViewAccountDetails = {
  registeredAddress: '',
  accountAddress: '',
}

const initialAccountStatus = {
  accountId: null,
  accountName: '',
  accountStatus: null,
  accountType: null,
  updated: false,
}

const ViewAccount: FC = () => {
  const { profileContract } = useContext(ProfileContractContext)
  const { registeredAccounts } = useContext(ProfileContractAPIContext)
  const [data, setData] = useState<IViewAccountDetails>(initialState)
  const [checked, setChecked] = useState<boolean>(false)
  const [accountStatus, setAccountStatus] =
    useState<IAccountStatus>(initialAccountStatus)
  const [isRegisteredAddressFieldValid, setIsRegisteredAddressFieldValid] =
    useState<boolean>(false)
  const [isAccountAddressFieldValid, setIsAccountAddressFieldValid] =
    useState<boolean>(true)
  const [accountAddressFieldErrorMsg, setAccountAddressFieldErrorMsg] =
    useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const watchChecked = () => {
      if (checked) {
        setIsRegisteredAddressFieldValid(false)
      }

      setAccountStatus(initialAccountStatus)
    }

    watchChecked()
  }, [checked])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Custom validation starts here
    if (name === 'registeredAddress') {
      if (value === 'DEFAULT' || value === '') {
        setIsRegisteredAddressFieldValid(false)
      } else {
        setIsRegisteredAddressFieldValid(true)
        setIsAccountAddressFieldValid(true)
      }
    }

    if (name === 'accountAddress') {
      if (value === '') {
        setIsAccountAddressFieldValid(false)
        setAccountAddressFieldErrorMsg('This field is required')
      } else if (!value.startsWith('0x') || value.length !== 42) {
        setIsAccountAddressFieldValid(false)
        setAccountAddressFieldErrorMsg(
          'A valid account address starts with 0x and 42 characters long.'
        )
      } else {
        setIsAccountAddressFieldValid(true)
        setIsRegisteredAddressFieldValid(true)
      }
    }
    // Custom validation ends here

    setData({ ...data, [name]: value })
  }

  const handleViewAccount = async (e: any) => {
    e.preventDefault()

    const { registeredAddress, accountAddress } = data
    let address: string

    if (!registeredAccounts.length || checked) {
      address = accountAddress
    } else {
      address = registeredAddress
    }

    const contractResp = await profileContract?.methods
      .getAccountInfoByAddress(address)
      .call()
    setIsLoading(true)
    const { accountId, accountName, accountStatusValue, accountTypeValue } =
      contractResp

    setTimeout(() => {
      setIsLoading(false)
      setAccountStatus({
        accountId: parseInt(accountId),
        accountName,
        accountStatus: parseInt(accountStatusValue),
        accountType: parseInt(accountTypeValue),
        updated: true,
      })
    }, 1000)
  }

  return (
    <section className="container has-background-light">
      <div className="columns is-multiline">
        <div className="column is-10 is-offset-2 register">
          <div className="columns">
            <div className="column left mt-6">
              <ViewAccountForm
                handleChange={handleChange}
                handleViewAccount={handleViewAccount}
                checked={checked}
                setChecked={setChecked}
                isRegisteredAddressFieldValid={isRegisteredAddressFieldValid}
                isAccountAddressFieldValid={isAccountAddressFieldValid}
                accountAddressFieldErrorMsg={accountAddressFieldErrorMsg}
                isLoading={isLoading}
              />

              {accountStatus.updated && (
                <div className="mt-5">
                  <ViewAccountStatus
                    accountName={accountStatus.accountName}
                    accountStatus={accountStatus.accountStatus}
                    accountType={accountStatus.accountType}
                  />
                </div>
              )}
            </div>

            <div className="column right has-text-centered">
              <img
                src={ProfileTrackingImage}
                alt="profile tracking"
                className="side-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ViewAccount
