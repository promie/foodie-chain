import React, { FC, useContext, useEffect } from 'react'
import DashboardHeroHeader from '../../../components/DashboardHeroHeader'
import DashboardHeroFooter from '../../../components/DashboardHeroFooter'
import { ProfileContractAPIContext } from '../../../contexts/ProfileContractAPI'

const Dashboard: FC = () => {
  const { getAllParticipants, registeredAccounts } = useContext(
    ProfileContractAPIContext
  )

  useEffect(() => {
    getAllParticipants()
  }, [])

  return (
    <div>
      <DashboardHeroHeader userType={'Participant'} />
      <section className="info-tiles mt-5">
        <div className="tile is-ancestor has-text-centered">
          <div className="tile is-parent">
            <article className="tile is-child box">
              <p className="title">{registeredAccounts.length}</p>
              <p className="subtitle">Registered</p>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="tile is-child box">
              <p className="title">0</p>
              <p className="subtitle">Products</p>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="tile is-child box">
              <p className="title">0</p>
              <p className="subtitle">Documents</p>
            </article>
          </div>
        </div>
      </section>

      <DashboardHeroFooter />
    </div>
  )
}

export default Dashboard
