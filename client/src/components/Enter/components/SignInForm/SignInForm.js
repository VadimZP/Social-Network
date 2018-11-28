import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import './SignInForm.css'
import { userSignInRequested } from 'redux/modules/global'

class SignInForm extends Component {
  static propTypes = {
    isLogged: PropTypes.bool,
    userSignInRequested: PropTypes.func.isRequired
  }

  state = {
    email: '',
    password: '',
    emailErr: false,
    passErr: false
  }

  emailChange = (e) => this.setState({ email: e.target.value.trim() })

  passwordChange = (e) => this.setState({ password: e.target.value.replace(/[^A-Za-z0-9]+/g, '').trim() })

  signIn = () => {
    const { email, password } = this.state
    const { userSignInRequested } = this.props

    userSignInRequested(email, password)
  }

  render() {
    let isDisabled = false

    const {
      email,
      password,
      emailErr,
      passErr
    } = this.state

    const { isLogged } = this.props

    if (!email || (!password || password.length < 6)) {
      isDisabled = true
    }
    if (emailErr) {
      isDisabled = true
    }

    return (
      <form className="form-sign-in">
        <label htmlFor="inputEmail" className="sr-only">
          Email address
        </label>
        {emailErr && <p style={{ color: 'red', fontSize: 13, paddingTop: 5 }}>Empty or incorrect input</p>}
        <input
          type="email"
          id="inputEmail"
          value={email}
          onChange={this.emailChange}
          onBlur={() => {
            const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if (!email || !email.match(emailFormat)) {
              this.setState({ emailErr: true })
              return
            }
            this.setState({ emailErr: false })
          }}
          required
        />
        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
        {passErr && <p style={{ color: 'red', fontSize: 13, paddingTop: 5 }}>Empty or too short input</p>}
        <input
          type="password"
          id="inputPassword"
          value={password}
          onChange={this.passwordChange}
          onBlur={() => {
            if (password.length < 6) {
              this.setState({ passErr: true })
              return
            }
            this.setState({ passErr: false })
          }}
          required
        />
        <button
          className="btn-submit-form"
          type="button"
          style={isDisabled ? { background: '#f1f1f1' } : {}}
          onClick={this.signIn}
          disabled={isDisabled}
        >
          Sign In
        </button>
        {isLogged === false && <h2 style={{ textAlign: 'center', marginTop: 50 }}>Incorrect username or password.</h2>}
      </form>
    )
  }
}

SignInForm.defaultProps = {
  isLogged: null
}

const mapStateAppToProps = state => ({
  isLogged: state.getIn(['global', 'isLogged'])
})

export default withRouter(
  connect(
    mapStateAppToProps,
    {
      userSignInRequested
    }
  )(SignInForm)
)
