import React, { FC } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProfileContextProvider from './contexts/ProfileContract'
import ProfileContractAPIProvider from './contexts/ProfileContractAPI'
import DocumentContextProvider from './contexts/DocumentContract/DocumentContractProvider'
import DocumentContractAPIProvider from './contexts/DocumentContractAPI/DocumentContractAPIProvider'
import TraceContractAPIProvider from './contexts/TraceContractAPI/TraceContractAPIProvider'
import TraceContractContext from './contexts/TraceContract/TraceContractProvider'
import ProductContractAPIProvider from './contexts/ProductContractAPI/ProductContractAPIProvider'
import ProductContractContext from './contexts/ProductContract/ProductContractProvider'
import Landing from './pages/Landing'
import Regulator from './pages/Regulator'
import Participant from './pages/Participant'
// import Track from './pages/Track'

const App: FC = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path={'/'} component={Landing} />
          <Route path={'/regulator'} component={Regulator} />
          <Route path={'/participant'} component={Participant} />
          {/* <Route path={'/track'} component={Track} /> */}
        </Switch>
      </Router>
    </div>
  )
}

export default () => (
  <ProfileContextProvider>
    <ProfileContractAPIProvider>
      <DocumentContextProvider>
        <DocumentContractAPIProvider>
          <ProductContractContext>
            <ProductContractAPIProvider>
              <TraceContractContext>
                <TraceContractAPIProvider>
                  <App />
                </TraceContractAPIProvider>
              </TraceContractContext>
            </ProductContractAPIProvider>
          </ProductContractContext>
        </DocumentContractAPIProvider>
      </DocumentContextProvider>
    </ProfileContractAPIProvider>
  </ProfileContextProvider>
)
