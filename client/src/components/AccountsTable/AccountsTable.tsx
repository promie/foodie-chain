import React, { FC, useMemo } from 'react'
import { useTable, useGlobalFilter, usePagination } from 'react-table'
import { IAccountsTableProps } from '../../interfaces/contract'
import GlobalFilter from '../GlobalFilter'
import './accountstable.css'

const AccountsTable: FC<IAccountsTableProps> = ({ columns, data }) => {
  const cols = useMemo(() => columns, [])
  const d = useMemo(() => data, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns: cols,
      data: d,
    },
    useGlobalFilter,
    usePagination
  )

  const { globalFilter, pageIndex } = state

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-5 is-middle">
        <div>
          <button
            className="button"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </button>
        </div>

        <div className="spacing">
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
        </div>

        <div>
          <button
            className="button"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}

export default AccountsTable
