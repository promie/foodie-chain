import React, { FC } from 'react'
import { IAccountStatus } from '../../interfaces/contract'
import { AccountType, AccountStatus } from '../../enums/contract'
import { titleCase } from '../../helpers'
import './viewaccountstatus.css'

const ViewAccountStatus: FC<IAccountStatus> = ({
  accountName,
  accountStatus,
  accountType,
}) => {
  const classNameByColourStatus = (status: number): string => {
    switch (status) {
      case AccountStatus.PENDING:
        return 'fas fa-circle status-pending'
      case AccountStatus.REJECTED:
        return 'fas fa-circle status-rejected'
      case AccountStatus.APPROVED:
        return 'fas fa-circle status-approved'
      default:
        return 'fas fa-circle'
    }
  }

  return (
    <div>
      {accountName !== '' ? (
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr className="th">
              <th>Name</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{accountName}</td>
              <td className="is-flex">
                <span className="icon">
                  <i className={classNameByColourStatus(accountStatus!)} />{' '}
                </span>
                {titleCase(AccountStatus[accountStatus!])}
              </td>
              <td>{titleCase(AccountType[accountType!])}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="notification is-warning">
          The account address you are looking has not been registered. Please
          try again with a different account address.
        </div>
      )}
    </div>
  )
}

export default ViewAccountStatus
