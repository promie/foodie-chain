import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import Logo from '../../assets/logo.jpg'
import './homenavbar.css'
import { IUserTypeProps } from '../../interfaces/contract'

const HomeNavbar: FC<IUserTypeProps> = ({ type }) => {
  // TODO - For mobile view, add a function to toggle menu bar

  const isRegulator = type === 'regulator'
  const isParticipant = type === 'participant'

  // NOTE: History.push is preferred over href because href causes the page to re-render.
  // Please ignore the warning on the console for now
  const history = useHistory()

  const goToRegulator = () => {
    history.push('/regulator')
  }

  const goToParticipant = () => {
    history.push('/participant')
  }

  const goLanding = () => {
    history.push('/')
  }

  return (
    <nav className="navbar is-white">
      <div className="container">
        <div className="navbar-brand">
          <a className="brand-text" onClick={goLanding}>
            <img src={Logo} alt={'Logo'} className="home-logo" />
          </a>
          <div className="navbar-burger burger" data-target="navMenu">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div id="navMenu" className="navbar-menu">
          <div className="navbar-start">
            <a
              className={isRegulator ? 'is-active navbar-item' : 'navbar-item'}
              onClick={goToRegulator}
            >
              Regulator
            </a>
            <a
              className={
                isParticipant ? 'is-active navbar-item' : 'navbar-item'
              }
              onClick={goToParticipant}
            >
              Participant
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HomeNavbar
