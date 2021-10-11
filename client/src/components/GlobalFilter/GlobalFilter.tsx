import React, { FC } from 'react'

interface IGlobalFilterProps {
  objectName?: any
  filter: any
  setFilter: any
}

const GlobalFilter: FC<IGlobalFilterProps> = ({ objectName, filter, setFilter }) => {
  return (
    <div className="container mb-5">
      <div className="field">
        <label className="label">
          Search By {objectName||"Account"} Name Or {objectName||"Account"} Address
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            value={filter || ''}
            onChange={(e) => setFilter(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default GlobalFilter
