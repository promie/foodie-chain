import React, { FC } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import HomeNavbar from '../../components/HomeNavbar'
import SideNavBar from '../../components/SideNavBar'
import Dashboard from './Dashboard'
import ReviewAccounts from './ReviewAccounts'
import VerifyDocument from './VerifyDocument'

const Regulator: FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <HomeNavbar type={'regulator'} />
      <div className="container mt-5">
        <div className="columns">
          <div className="column is-3">
            <SideNavBar type={'regulator'} />
          </div>

          <div className="column is-9">
            <Switch>
              <Route exact path={path} component={Dashboard} />
              <Route
                exact
                path={`${path}/review-accounts`}
                component={ReviewAccounts}
              />
              <Route
                exact
                path={`${path}/verify-document`}
                component={VerifyDocument}
              />
            </Switch>
          </div>
        </div>
      </div>
    </>
  )
}

export default Regulator
