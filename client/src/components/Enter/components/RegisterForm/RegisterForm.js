import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import './RegisterForm.css'
import Utils from 'utils/Utils'
import { userRegistrationRequested } from 'redux/modules/global'
import RegisterResult from './components/RegisterResult/RegisterResult'

class RegisterForm extends Component {
  static propTypes = {
    registrationRequestWasMade: PropTypes.bool,
    userRegistrationRequested: PropTypes.func.isRequired,
  }

  state = {
    userData: {
      email: '',
      password: '',
      name: '',
      surname: '',
      gender: 'male',
      birth: {
        day: 1,
        month: 'January',
        year: new Date().getFullYear()
      },
      country: 'Afghanistan',
      avatar: `#${Math.random().toString(16).slice(2, 8)}`
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.registerSuccess !== prevState.registerSuccess || nextProps.registrationRequestWasMade !== prevState.registrationRequestWasMade) {
      return {
        registerSuccess: nextProps.registerSuccess,
        isLoading: nextProps.registrationRequestWasMade
      }
    }
    return { isLoading: false }
  }

  emailChange = e => {
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, email: e.target.value.trim() }
    }))
  }

  passwordChange = e => {
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, password: e.target.value.replace(/[^A-Za-z0-9]+/g, '').trim() }
    }))
  }

  nameChange = e => {
    let name = e.target.value
    if (e.target.value) {
      name = e.target.value[0].toUpperCase() +
      e.target.value.slice(1).toLowerCase()
    }
    e.persist()
    this.setState(prevState => ({
      userData: {
        ...prevState.userData,
        name: name.replace(/[^A-Za-z]+/g, '').trim()
      }
    }))
  }

  surnameChange = e => {
    let surname = e.target.value
    if (e.target.value) {
      surname = e.target.value[0].toUpperCase() +
      e.target.value.slice(1).toLowerCase()
    }
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, surname: surname.replace(/[^A-Za-z]+/g, '').trim() }
    }))
  }

  genderChange = e => {
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, gender: e.target.value }
    }))
  }

  birthChange = (arg, e) => {
    e.persist()
    this.setState(prevState => ({
      userData: {
        ...prevState.userData,
        birth: { ...prevState.userData.birth, [arg]: e.target.value }
      }
    }))
  }

  countryChange = e => {
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, country: e.target.options[e.target.selectedIndex].text }
    }))
  }

  registerUser = () => {
    const { userRegistrationRequested } = this.props

    this.setState({ isLoading: true, registrationRequest: true })
    userRegistrationRequested(this.state.userData)
  }

  render() {
    let isDisabled = false

    const {
      email,
      password,
      name,
      surname,
      gender,
    } = this.state.userData

    const {
      emailErr,
      passErr,
      registrationRequest,
      registerSuccess,
      isLoading
    } = this.state

    if (!email ||
      (!password || password.length < 6) ||
      (!name || name.length < 2) ||
      (!surname || surname.length < 2)
    ) {
      isDisabled = true
    }
    if (emailErr) {
      isDisabled = true
    }

    return (
      <div>
        <form
          className="form-register"
          action="/register"
        >
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
          <label htmlFor="inputName" className="sr-only">
            Name
          </label>
          <input
            type="text"
            id="inputName"
            value={name}
            onChange={this.nameChange}
            required
          />
          <label htmlFor="inputSurname" className="sr-only">
            Surname
          </label>
          <input
            type="text"
            id="inputSurname"
            value={surname}
            onChange={this.surnameChange}
            required
          />
          <div className="radio-wrapper">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male' && true}
              onChange={this.genderChange}
            />
            Male
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female' && true}
              onChange={this.genderChange}
            />
            Female
          </div>
          <div className="select-wrapper">
            <span>Birthday:</span>
            <select name="day" onChange={this.birthChange.bind(this, 'day')}>
              {Utils.getDays().map(d => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              name="month"
              onChange={this.birthChange.bind(this, 'month')}
            >
              {Utils.getMonths().map(m => (
                <option value={m} key={m}>
                  {m}
                </option>
              ))}
            </select>
            <select name="years" onChange={this.birthChange.bind(this, 'year')}>
              {Utils.getYears().map(y => (
                <option value={y} key={y}>
                  {y}
                </option>
              ))}
            </select>
            <select name="countries" onChange={this.countryChange}>
              {Utils.getCountries().map(item => (
                <option value={item.alpha2Code} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn-submit-form"
            type="button"
            style={isDisabled ? { background: '#f1f1f1' } : {}}
            onClick={this.registerUser}
            disabled={isDisabled}
          >
            Register
          </button>
        </form>
        {registrationRequest && (
          <RegisterResult registerSuccess={registerSuccess} isLoading={isLoading} />
        )}
      </div>
    )
  }
}

RegisterForm.defaultProps = {
  registrationRequestWasMade: false
}

const mapStateAppToProps = state => ({
  registrationRequestWasMade: state.getIn(['global', 'registrationRequestWasMade']),
  registerSuccess: state.getIn(['global', 'registerSuccess'])
})

export default withRouter(
  connect(
    mapStateAppToProps,
    {
      userRegistrationRequested
    }
  )(RegisterForm)
)
