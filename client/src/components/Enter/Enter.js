import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import './Enter.css'
import RegisterForm from './components/RegisterForm/RegisterForm'
import SignInForm from './components/SignInForm/SignInForm'

/* userData: ImmutablePropTypes.mapOf(
  ImmutablePropTypes.contains({
    id: PropTypes.number,
    email: PropTypes.string,
    password: PropTypes.string,
    name: PropTypes.string,
    surname: PropTypes.string,
    gender: PropTypes.string,
    birth: PropTypes.string,
    avatar: PropTypes.string
  })
).isRequired, */

class Enter extends Component {
  static propTypes = {
    userEmail: PropTypes.string,
    isLogged: PropTypes.bool
  }

  state = {
    componentBody: 'register'
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.setState({ componentBody: e.target.classList[0] })
    }
  }

  render() {
    const prevPath = this.props.location.state || { prevLocation: '/' }
    const { isLogged, userEmail } = this.props
    const { componentBody } = this.state

    if (isLogged) {
      return prevPath.prevLocation.split('/')[2] !== userEmail ? (
        <Redirect to={`user-page/${userEmail}`} />
      ) : (
        <Redirect to={`${prevPath.prevLocation}`} />
      )
    }

    return (
      <div className="enter">
        <header className="enter-header">
          <div
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.setState({ componentBody: 'register' })}
            className={
              componentBody === 'register' ? 'register active' : 'register'
            }
            role="button"
            tabIndex={0}
          >
            Register
          </div>
          <div
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.setState({ componentBody: 'sign-in' })}
            className={
              componentBody === 'sign-in' ? 'sign-in active' : 'sign-in'
            }
            role="button"
            tabIndex={0}
          >
            Sign In
          </div>
        </header>
        <div className="enter-body">
          {componentBody === 'register' && <RegisterForm />}
          {componentBody === 'sign-in' && <SignInForm />}
        </div>
      </div>
    )
  }
}

Enter.defaultProps = {
  isLogged: false,
  userEmail: null
}

const mapStateToProps = state => (
  { isLogged: state.getIn(['global', 'isLogged']), userEmail: state.getIn(['global', 'userData', 'email']) }
)

export default withRouter(connect(mapStateToProps)(Enter))
