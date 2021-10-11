import React, { FC, useContext } from 'react'
import { ProfileContractContext } from '../../contexts/ProfileContract'

const ConnectionStatus: FC = () => {
  const { profileContract } = useContext(ProfileContractContext)

  const reConnect = () => {
    window.location.reload()
  }

  return (
    <>
      {profileContract ? (
        <span className="tag is-success is-light">Connected</span>
      ) : (
        <span className="tag is-warning is-light">Not Connected</span>
      )}

      {!profileContract && (
        <>
          <span className="icon-text pointer" onClick={reConnect}>
            <span className="icon has-text-info icon-size">
              <i className="fas fa-link" />
            </span>
          </span>

          <div className="notification notification-box mt-2">
            Please ensure that you have meta-mask properly configured before
            connecting. To connect, simply click on the chain icon.
          </div>
        </>
      )}
    </>
  )
}

export default ConnectionStatus
