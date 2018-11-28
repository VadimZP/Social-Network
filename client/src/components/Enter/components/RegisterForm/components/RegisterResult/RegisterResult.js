import React from 'react'
import PropTypes from 'prop-types'
import './RegisterResult.css'

export default function RegisterResult({
  registerSuccess = false,
  isLoading = false
}) {
  if (isLoading) return <h3>Proccessing...</h3>
  if (!isLoading && registerSuccess) {
    return (
      <div className="registration-result">
        <h2>Thanks for registration!</h2>
        <h2>Welcome</h2>
      </div>
    )
  }
  return (
    <div className="registration-result">
      <h2>This account is already registered!</h2>
    </div>
  )
}

RegisterResult.propTypes = {
  registerSuccess: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
}
