import React, { FC } from 'react'
import Banner from '../../assets/banner.jpg'
import './dashboardherofooter.css'

const DashboardHeroFooter: FC = () => {
  return (
    <section className="hero welcome is-small mt-5">
      <div className="container">
        <img src={Banner} alt="random" className="hero-image" />
      </div>
    </section>
  )
}

export default DashboardHeroFooter
