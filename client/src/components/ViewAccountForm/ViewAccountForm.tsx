import React, { FC, useContext, useEffect } from 'react'
import { ProfileContractAPIContext } from '../../contexts/ProfileContractAPI'
import {
  IParticipantDetails,
  IViewAccountFormProps,
} from '../../interfaces/contract'
import { shortenedAddress, titleCase } from '../../helpers/stringMutations'
import { AccountType } from '../../enums/contract'

const ViewAccountForm: FC<IViewAccountFormProps> = ({
  handleChange,
  handleViewAccount,
  checked,
  setChecked,
  isRegisteredAddressFieldValid,
  isAccountAddressFieldValid,
  accountAddressFieldErrorMsg,
  isLoading,
}) => {
  const { registeredAccounts, getAllParticipants } = useContext(
    ProfileContractAPIContext
  )

  useEffect(() => {
    getAllParticipants()
  }, [])

  return (
    <>
      <h1 className="title is-4">View your account progress</h1>
      <form>
        {registeredAccounts.length && !checked ? (
          <div className="select is-fullwidth">
            <select
              defaultValue={'DEFAULT'}
              name="registeredAddress"
              id="registeredAddress"
              onChange={handleChange}
            >
              <option value={'DEFAULT'} disabled>
                Select Account Address
              </option>
              {registeredAccounts?.map(
                (account: IParticipantDetails, idx: number) => (
                  <option key={idx} value={account.accountAddress}>
                    {`${account.accountName} (${titleCase(
                      AccountType[account.accountType]
                    )}) [${shortenedAddress(account.accountAddress)}`}
                    ]
                  </option>
                )
              )}
            </select>
          </div>
        ) : null}

        {registeredAccounts.length ? (
          <div className="mt-2 mb-2">
            <label className="checkbox">
              <input
                type="checkbox"
                defaultChecked={checked}
                onChange={() => setChecked(!checked)}
              />{' '}
              Account address not on list
            </label>
          </div>
        ) : null}

        {!registeredAccounts.length || checked ? (
          <div className="field">
            <div className="control">
              <input
                className={
                  isAccountAddressFieldValid ? 'input' : 'input is-danger'
                }
                type="text"
                placeholder="Account address"
                name="accountAddress"
                id="accountAddress"
                onChange={handleChange}
              />
            </div>
            <p
              className={
                isAccountAddressFieldValid ? 'help is-hidden' : 'help is-danger'
              }
            >
              {accountAddressFieldErrorMsg}
            </p>
          </div>
        ) : null}

        <button
          className={
            isLoading
              ? 'button is-block is-link is-fullwidth mt-3 is-loading'
              : 'button is-block is-link is-fullwidth mt-3'
          }
          onClick={(e) => handleViewAccount(e)}
          disabled={
            !isRegisteredAddressFieldValid || !isAccountAddressFieldValid
          }
        >
          View Account
        </button>
      </form>
    </>
  )
}

export default ViewAccountForm
