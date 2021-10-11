import React, { FC } from 'react'

interface IDashboardHeroHeaderProps {
  userType: string
}

const DashboardHeroHeader: FC<IDashboardHeroHeaderProps> = ({ userType }) => {
  return (
    <section className="hero is-link welcome is-small">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Hello, {userType}.</h1>
          <h2 className="subtitle">I hope you are having a great day!</h2>
        </div>
      </div>
    </section>
  )
}

export default DashboardHeroHeader
