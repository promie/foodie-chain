import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import './sidenavbar.css'
import { ProfileContractContext } from '../../contexts/ProfileContract'
import { IUserTypeProps, IMenuList } from '../../interfaces/contract'
import ConnectionStatus from '../ConnectionStatus'

const SideNavBar: FC<IUserTypeProps> = ({ type }) => {
  const { profileContract } = useContext(ProfileContractContext)
  const isRegulator = type === 'regulator'
  const history = useHistory()
  const pathName = window.location.pathname

  const navigateTo = (url: string) => {
    history.push(url)
  }

  const navigateToDashboard = () => {
    if (pathName.includes('regulator')) {
      navigateTo('/regulator')
    }
    if (pathName.includes('participant')) {
      navigateTo('/participant')
    }
  }

  const regulatorMenu = [
    {
      title: 'Review Accounts',
      link: '/regulator/review-accounts',
    },
    {
      title: 'Verify Document',
      link: '/regulator/verify-document',
    },
  ]

  const participationMenu: IMenuList[] = [
    {
      title: 'Register Account',
      link: '/participant/register',
    },
    {
      title: 'View Account',
      link: '/participant/view-account',
    },
    {
      title: 'Add Document',
      link: '/participant/add-document',
    },
    {
      title: 'Product',
      link: '/participant/product',
    },
    {
      title: 'Tracking',
      link: '/participant/tracking',
    },
    {
      title: 'Recall',
      link: '/participant/recall',
    },
    {
      title: 'View Supply Chain',
      link: '/participant/supplychain',
    },
  ]

  const navigationLinks = isRegulator
    ? regulatorMenu.map((menu: IMenuList, idx: number) => (
      <li key={idx}>
        <a
          className={pathName === menu.link ? 'is-active' : ''}
          onClick={() => navigateTo(menu.link)}
        >
          {menu.title}
        </a>
      </li>
    ))
    : participationMenu.map((menu, idx: number) => (
      <li key={idx}>
        <a
          className={pathName === menu.link ? 'is-active' : ''}
          onClick={() => navigateTo(menu.link)}
        >
          {menu.title}
        </a>
      </li>
    ))

  return (
    <div>
      <aside className="menu is-hidden-mobile">
        <div className="menu-label">
          <ConnectionStatus />
        </div>
        <ul className="menu-list">
          <li>
            <a
              className={
                pathName === '/regulator' || pathName === '/participant'
                  ? 'is-active'
                  : ''
              }
              onClick={() => navigateToDashboard()}
            >
              Dashboard
            </a>
            <ul>{navigationLinks}</ul>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default SideNavBar
