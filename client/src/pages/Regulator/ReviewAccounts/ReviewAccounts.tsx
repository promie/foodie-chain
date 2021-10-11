import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import { ProfileContractContext } from '../../../contexts/ProfileContract'
import { ProfileContractAPIContext } from '../../../contexts/ProfileContractAPI'
import AccountsTable from '../../../components/AccountsTable'
import { AccountType, AccountStatus } from '../../../enums/contract'
import { titleCase } from '../../../helpers'
import getAccounts from '../../../utils/getAccounts'

const ReviewAccounts: FC = () => {
  const { profileContract, accounts } = useContext(ProfileContractContext)
  const {
    pendingAccounts,
    approvedAccounts,
    rejectedAccounts,
    updateAccountStatus,
  } = useContext(ProfileContractAPIContext)
  const [pendingAccountsActiveClass, setPendingAccountsActiveClass] =
    useState<string>('is-active')
  const [rejectedAccountsActiveClass, setRejectedAccountsActiveClass] =
    useState<string>('')
  const [approvedAccountsActiveClass, setApprovedAccountsActiveClass] =
    useState<string>('')

  const switchTab = (accountStatus: number) => {
    switch (accountStatus) {
      case AccountStatus.PENDING:
        setPendingAccountsActiveClass('is-active')
        setRejectedAccountsActiveClass('')
        setApprovedAccountsActiveClass('')
        break
      case AccountStatus.REJECTED:
        setRejectedAccountsActiveClass('is-active')
        setPendingAccountsActiveClass('')
        setApprovedAccountsActiveClass('')
        break
      case AccountStatus.APPROVED:
        setApprovedAccountsActiveClass('is-active')
        setPendingAccountsActiveClass('')
        setRejectedAccountsActiveClass('')
        break
      default:
        break
    }
  }

  const COLUMNS = [
    {
      Header: 'Account Name',
      accessor: 'accountName',
    },
    {
      Header: 'Account Address',
      accessor: 'accountAddress',
    },
    {
      Header: 'Account Type',
      accessor: 'accountType',
      Cell: ({ value }: any) => {
        return titleCase(AccountType[value])
      },
    },
    {
      Header: 'Account Status',
      accessor: 'accountStatus',
      Cell: ({
        value,
        row: {
          original: { accountAddress, accountStatus: originalAccountStatus },
        },
      }: any) => {
        const handleChange = async (
          e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
          const { value: updatedAccountStatus } = e.target

          try {
            console.log("accounts", accounts)
            const _accounts = await getAccounts(accounts)
            const updateStatus = await profileContract?.methods
              .approveAccount(accountAddress, updatedAccountStatus)
              .send({ from: _accounts[0] })

            if (updateStatus) {
              updateAccountStatus(
                accountAddress,
                parseInt(updatedAccountStatus)
              )

              setTimeout(() => {
                switchTab(originalAccountStatus)
              }, 200)
              switchTab(parseInt(updatedAccountStatus))
            }
          } catch (error) {
            console.log(error.message)
          }
        }

        return (
          <div className="select">
            <select
              defaultValue={value}
              name="accountType"
              id="accountType"
              onChange={handleChange}
            >
              {value === AccountStatus.PENDING && (
                <>
                  <option value={value}>
                    {titleCase(AccountStatus[value])}
                  </option>
                  <option value={AccountStatus.REJECTED}>Reject</option>
                  <option value={AccountStatus.APPROVED}>Approve</option>
                </>
              )}

              {value === AccountStatus.REJECTED && (
                <>
                  <option value={value}>
                    {titleCase(AccountStatus[value])}
                  </option>
                  <option value={AccountStatus.PENDING}>Pending</option>
                  <option value={AccountStatus.APPROVED}>Approve</option>
                </>
              )}

              {value === AccountStatus.APPROVED && (
                <>
                  <option value={value}>
                    {titleCase(AccountStatus[value])}
                  </option>
                  <option value={AccountStatus.PENDING}>Pending</option>
                  <option value={AccountStatus.REJECTED}>Reject</option>
                </>
              )}
            </select>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className="tabs is-centered is-boxed">
        <ul>
          <li
            className={pendingAccountsActiveClass}
            onClick={() => switchTab(AccountStatus.PENDING)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-clock" aria-hidden="true" />
              </span>
              <span>Pending Accounts ({pendingAccounts.length})</span>
            </a>
          </li>
          <li
            className={rejectedAccountsActiveClass}
            onClick={() => switchTab(AccountStatus.REJECTED)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-times-circle" aria-hidden="true" />
              </span>
              <span>Rejected Accounts ({rejectedAccounts.length})</span>
            </a>
          </li>
          <li
            className={approvedAccountsActiveClass}
            onClick={() => switchTab(AccountStatus.APPROVED)}
          >
            <a>
              <span className="icon is-small">
                <i className="fas fa-check-circle" aria-hidden="true" />
              </span>
              <span>Approved Accounts ({approvedAccounts.length})</span>
            </a>
          </li>
        </ul>
      </div>
      <section className="container">
        {pendingAccountsActiveClass && (
          <div className="column is-12">
            {!pendingAccounts.length ? (
              <div className="notification is-warning">
                No accounts in pending.
              </div>
            ) : (
              <AccountsTable columns={COLUMNS} data={pendingAccounts} />
            )}
          </div>
        )}

        {rejectedAccountsActiveClass && (
          <div className="column is-12">
            {!rejectedAccounts.length ? (
              <div className="notification is-warning">
                No accounts in rejected.
              </div>
            ) : (
              <AccountsTable columns={COLUMNS} data={rejectedAccounts} />
            )}{' '}
          </div>
        )}

        {approvedAccountsActiveClass && (
          <div className="column is-12">
            {!approvedAccounts.length ? (
              <div className="notification is-warning">
                No accounts in approved.
              </div>
            ) : (
              <AccountsTable columns={COLUMNS} data={approvedAccounts} />
            )}{' '}
          </div>
        )}
      </section>
    </>
  )
}

export default ReviewAccounts
