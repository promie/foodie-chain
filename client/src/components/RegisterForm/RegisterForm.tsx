import React, { FC, ChangeEvent } from 'react'
import {
  IAccountTypeDropdown,
  IRegisterFormProps,
} from '../../interfaces/contract'
import { AccountType } from '../../enums/contract'

const RegisterForm: FC<IRegisterFormProps> = ({
  showErrorNotice,
  errorMessage,
  handleChange,
  isAccountAddressFieldValid,
  accountAddressFieldErrorMsg,
  isAccountNameFieldValid,
  isLoading,
  handleRegister,
  accountType,
}) => {
  const accountTypeDropDownOptions: IAccountTypeDropdown[] = [
    {
      value: AccountType.FARMER,
      account: 'Farmer',
    },
    {
      value: AccountType.MANUFACTURER,
      account: 'Manufacturer',
    },
    {
      value: AccountType.RETAILER,
      account: 'Retailer',
    },
    {
      value: AccountType.CONSUMER,
      account: 'Consumer',
    },
    {
      value: AccountType.LOGISTICS,
      account: 'Logistic',
    },
    {
      value: AccountType.ORACLE,
      account: 'Oracle',
    },
  ]

  return (
    <>
      <h1 className="title is-4">Register today</h1>
      <p className="description">Join us now to deliver value!</p>

      {showErrorNotice && (
        <div className="notification is-danger is-light mt-3">
          {errorMessage}
        </div>
      )}

      <form className="mt-5">
        <div className="field">
          <div className="control">
            <input
              className={
                isAccountAddressFieldValid ? 'input' : 'input is-danger'
              }
              type="text"
              placeholder="Account Address"
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

        <div className="field">
          <div className="control">
            <input
              className={isAccountNameFieldValid ? 'input' : 'input is-danger'}
              type="text"
              placeholder="Account Name"
              name="accountName"
              id="accountName"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
          </div>
          <p
            className={
              isAccountNameFieldValid ? 'help is-hidden' : 'help is-danger'
            }
          >
            This field is required
          </p>
        </div>

        <div className="select is-fullwidth">
          <select
            defaultValue={'DEFAULT'}
            name="accountType"
            id="accountType"
            onChange={handleChange}
          >
            <option value={'DEFAULT'} disabled>
              Select Account Type
            </option>

            {accountTypeDropDownOptions.map(
              (account: IAccountTypeDropdown, idx: number) => (
                <option key={idx} value={account.value}>
                  {account.account}
                </option>
              )
            )}
          </select>
        </div>
        <button
          className={
            isLoading
              ? 'button is-block is-link is-fullwidth mt-3 is-loading'
              : 'button is-block is-link is-fullwidth mt-3'
          }
          onClick={(e) => handleRegister(e)}
          disabled={
            !isAccountAddressFieldValid ||
            !isAccountNameFieldValid ||
            accountType === -1
          }
        >
          Register
        </button>
        <br />
      </form>
    </>
  )
}

export default RegisterForm
