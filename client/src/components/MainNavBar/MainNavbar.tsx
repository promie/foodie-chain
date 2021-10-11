import React, { FC } from 'react'
import './mainnavbar.css'
import Logo from '../../assets/logo.jpg'

const MainNavbar: FC = () => {
  return (
    <nav className="navigation">
      <a href="../" className="anchor">
        <img src={Logo} alt="Logo" className="logo" />
      </a>
    </nav>
  )
}

export default MainNavbar
