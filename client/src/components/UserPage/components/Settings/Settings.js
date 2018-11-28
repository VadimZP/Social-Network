import React, { Component } from 'react'
import { connect } from 'react-redux'

import './Settings.css'
import Utils from 'utils/Utils'
import { changeSettingsRequested, uploadAvatarRequested } from 'redux/modules/global'
import * as Countries from 'iso-3166-1-alpha-2'


class Settings extends Component {
  state = {
    userData: {
      id: this.props.userData.get('id'),
      email: this.props.userData.get('email'),
      password: '',
      name: this.props.userData.get('name'),
      surname: this.props.userData.get('surname'),
      gender: this.props.userData.get('gender'),
      country: this.props.userData.get('country'),
      birth: {
        day: this.props.userData.get('birth').split(' ')[0],
        month: this.props.userData.get('birth').split(' ')[1],
        year: this.props.userData.get('birth').split(' ')[2]
      }
    }
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

  uploadAvatar = e => {
    const { uploadAvatarRequested } = this.props
    const { id } = this.state.userData
    const data = new FormData()

    data.append('userId', id)
    data.append('file', e.target.files[0])

    uploadAvatarRequested(data)
  }

  importAvatar = () => {
    document.getElementById('selectedFile').click()
  }

  submitSettingsChanges = () => {
    const { password } = this.state.userData
    const { changeSettingsRequested } = this.props

    if (password) {
      if (password.length < 6) {
        this.setState({ passErr: true })
        return
      }

      this.setState({ passErr: false })
    }
    changeSettingsRequested(this.state.userData)
  }

  render() {
    let isDisabled = false

    const {
      name,
      surname,
      password,
      email,
      gender,
      birth,
      country
    } = this.state.userData

    const {
      emailErr,
      passErr
    } = this.state

    if (!email ||
      (!name || name.length < 2) ||
      (!surname || surname.length < 2)
    ) {
      isDisabled = true
    }
    if (emailErr || passErr) {
      isDisabled = true
    }

    const avatar = this.props.userData.get('avatar')
    const avatarBg = avatar[0] === '#' ? { backgroundColor: avatar } : { backgroundImage: `url(${avatar})` }
    return (
      <div className="settings">
        <div
          className="avatar"
          style={avatarBg}
        >
          <div className="change-avatar">
            <input
              type="file"
              id="selectedFile"
              onChange={this.uploadAvatar}
              style={{ display: 'none' }}
            />
            <button type="button" onClick={this.importAvatar} />
          </div>
        </div>
        <div className="user-data">
          <div className="input-wrapper">
            <h3>Name</h3>
            <input
              type="text"
              id="inputName"
              value={name}
              onChange={this.nameChange}
            />
          </div>
          <div className="input-wrapper">
            <h3>Surame</h3>
            <input
              type="text"
              id="inputSurname"
              value={surname}
              onChange={this.surnameChange}
            />
          </div>
          <div className="input-wrapper">
            <h3>Email</h3>
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
            />
          </div>
          <div className="input-wrapper">
            <h3>Password</h3>
            {passErr && <p style={{ color: 'red', fontSize: 13, paddingTop: 5 }}>Empty or too short input</p>}
            <input
              type="password"
              id="inputPassword"
              onChange={this.passwordChange}
              onBlur={() => {
                if (!password.length) {
                  this.setState({ passErr: false })
                  return
                }
                this.setState({ passErr: false })
              }}
            />
          </div>
          <div className="select-wrapper">
            <span>Birthday:</span>
            <select
              name="day"
              selected={31}
              onChange={this.birthChange.bind(this, 'day')}
              defaultValue={birth.day}
            >
              {Utils.getDays().map(d => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              name="month"
              onChange={this.birthChange.bind(this, 'month')}
              defaultValue={birth.month}
            >
              {Utils.getMonths().map(m => (
                <option value={m} key={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              name="years"
              onChange={this.birthChange.bind(this, 'year')}
              defaultValue={birth.year}
            >
              {Utils.getYears().map(y => (
                <option value={y} key={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              name="countries"
              onChange={this.countryChange}
              defaultValue={Countries.getCode(country)}
            >
              {Utils.getCountries().map(item => (
                <option value={item.alpha2Code} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
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
        </div>
        <button
          type="button"
          className="btn-submit-settings"
          style={isDisabled ? { background: '#f1f1f1' } : {}}
          onClick={this.submitSettingsChanges}
          disabled={isDisabled}
        >
          Save changes
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userData: state.getIn(['global', 'userData'])
})

export default connect(
  mapStateToProps,
  {
    changeSettingsRequested,
    uploadAvatarRequested
  }
)(Settings)
