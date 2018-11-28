import React, { Component } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router'
import { connect } from 'react-redux'

import { getUsersRequested } from 'redux/modules/users'
import { getFriendsRequested } from 'redux/modules/friends'
import { getUserNotificationsRequested } from 'redux/modules/messages'

import './UserPage.css'

import Home from './components/Home/Home'
import Settings from './components/Settings/Settings'
import Friends from './components/Friends/Friends'
import Messages from './components/Messages/Messages'

class UserPage extends Component {
  componentDidMount() {
    const { userId, getUserNotificationsRequested, getFriendsRequested } = this.props

    getUserNotificationsRequested(userId)
    getFriendsRequested(userId)
  }

  logOut = () => {
    localStorage.clear()
    window.location.reload()
  }

  render() {
    const { location, match } = this.props

    if (location.pathname === match.url) {
      return <Redirect to={`${match.url}/home`} />
    }

    return (
      <div className="page-wrapper">
        <aside className="navigation">
          <ul>
            <NavLink className="nav-link" to={`${match.url}/home`}>
              <div className="the-icons span3">
                <i className="fontello-icon icon-home" />
              </div>
              Home
            </NavLink>
            <NavLink className="nav-link" to={`${match.url}/messages`}>
              <div className="the-icons span3">
                <i className="fontello-icon icon-mail-alt" />
              </div>
              Messages
            </NavLink>
            <NavLink className="nav-link" to={`${match.url}/friends`}>
              <div className="the-icons span3">
                <i className="fontello-icon icon-users" />
              </div>
              Friends
            </NavLink>
            <NavLink className="nav-link" to={`${match.url}/settings`}>
              <div className="the-icons span3">
                <i className="fontello-icon icon-cog" />
              </div>
              Settings
            </NavLink>
          </ul>
          <button
            type="button"
            className="btn-submit-logout"
            onClick={this.logOut}
          >
            <div className="the-icons span3">
              <i className="fontello-icon icon-logout" />
            </div>
            Log out
          </button>
        </aside>
        <div className="content-container" onScroll={this.handleScroll}>
          <Switch>
            <Route path={`${match.url}/home`} component={Home} />
            <Route path={`${match.url}/friends`} component={Friends} />
            <Route path={`${match.url}/settings`} component={Settings} />
            <Route path={`${match.url}/messages`} component={Messages} />
            <Route
              path={`${match.url}/profile-of-:email`}
              render={routeProps => <Home {...routeProps} />}
            />
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userId: state.getIn(['global', 'userData', 'id']),
  }
}

export default connect(
  mapStateToProps,
  {
    getUsersRequested,
    getUserNotificationsRequested,
    getFriendsRequested
  }
)(UserPage)
