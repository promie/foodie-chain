import React, { FC } from 'react'
import './registrationsuccess.css'
import { AccountType } from '../../enums/contract'
import { titleCase } from '../../helpers'

interface IRegistrationSuccessProps {
  accountName: string
  accountType: number
  accountAddress: string
  backToRegister: () => void
}

const RegistrationSuccess: FC<IRegistrationSuccessProps> = ({
  accountName,
  accountType,
  accountAddress,
  backToRegister,
}) => {
  return (
    <div className="registration-success mb-3">
      <div className="icon-text check-icon">
        <span className="icon has-text-success">
          <i className="fas fa-check-circle" />
        </span>
      </div>
      <div className="mt-5">
        <div className="notification is-info is-light">
          <div>
            Congratulations,{' '}
            <span className="has-text-weight-bold">{accountName}</span>!
          </div>
          <div>The registration was a success</div>
          <div className="mt-4">
            Your registration for account type{' '}
            <span className="has-text-weight-bold">
              {titleCase(AccountType[accountType])}
            </span>{' '}
            is now in pending. You can track the status of this account via the
            'View Account' menu and entering the below address:
          </div>
          <div className="mt-5 has-text-weight-bold">{accountAddress}</div>
        </div>
      </div>

      <div className="mt-3">
        <button className="button is-link" onClick={() => backToRegister()}>
          Back to register{' '}
        </button>
      </div>
    </div>
  )
}

export default RegistrationSuccess
