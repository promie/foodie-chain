import React, { FC } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import HomeNavbar from '../../components/HomeNavbar'
import SideNavBar from '../../components/SideNavBar'
import Dashboard from './Dashboard'
import RegisterAccount from './RegisterAccount'
import ViewAccount from './ViewAccount'
import AddDocument from './AddDocument'
import Product from './Product'
import Tracking from './Tracking'
import Recall from './Recall'
import SupplyChain from './SupplyChain'

const Participant: FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <HomeNavbar type={'participant'} />
      <div className="container mt-5">
        <div className="columns">
          <div className="column is-3">
            <SideNavBar type={'participant'} />
          </div>

          <div className="column is-9">
            <Switch>
              <Route exact path={path} component={Dashboard} />
              <Route
                exact
                path={`${path}/register`}
                component={RegisterAccount}
              />
              <Route
                exact
                path={`${path}/view-account`}
                component={ViewAccount}
              />
              <Route
                exact
                path={`${path}/add-document`}
                component={AddDocument}
              />
              <Route exact path={`${path}/product`} component={Product} />
              <Route exact path={`${path}/tracking`} component={Tracking} />
              <Route exact path={`${path}/recall`} component={Recall} />
              <Route
                exact
                path={`${path}/supplychain`}
                component={SupplyChain}
              />
            </Switch>
          </div>
        </div>
      </div>
    </>
  )
}

export default Participant
