import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'

import './App.css'
import Enter from 'components/Enter/Enter'
import UserPage from 'components/UserPage/UserPage'
import ModalContainer from 'components/Modal/Modal'

let PrivateRoute = ({ component: Component, path, openRoute }) => {
  return (
    <Route
      path={path}
      render={props => (
        openRoute ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { prevLocation: props.location.pathname }
            }}
          />
        )
      )}
    />
  )
}

const mapStateToProps = state => {
  return { openRoute: state.getIn(['global', 'openRoute']) }
}

PrivateRoute = withRouter(connect(mapStateToProps, null)(PrivateRoute))

const App = () => (
  <Router>
    <div className="App">
      <Route exact path="/" render={routeProps => <Enter {...routeProps} />} />
      <PrivateRoute path="/user-page/:email" component={UserPage} />
      <ModalContainer />
    </div>
  </Router>
)

export default App
