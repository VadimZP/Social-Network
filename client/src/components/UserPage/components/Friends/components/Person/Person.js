import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import './Person.css'

function Person({user, userEmail, children }) {
  const {
    name,
    surname,
    email,
    birth,
    avatar,
    gender
  } = user
  const avatarBg = avatar && avatar[0] === '#' ?
    { backgroundColor: avatar } :
    { backgroundImage: `url(${avatar})` }

  return (
    <li className="person">
      <Link to={{
        pathname: `/user-page/${userEmail}/profile-of-${email}`,
        state: {
          name,
          surname,
          email,
          birth,
          avatar,
          gender
        }
      }}
      >
        <div className="avatar" style={avatarBg} />
        {`${name} ${surname}`}
      </Link>
      {children}
    </li>
  )
}

Person.defaultProps = {
  children: []
}

Person.propTypes = {
  userEmail: PropTypes.string.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    name: PropTypes.string,
    surname: PropTypes.string,
    gender: PropTypes.string,
    birth: PropTypes.string,
    avatar: PropTypes.string
  }).isRequired,
  children: PropTypes.instanceOf(Object)
}

const mapStateToProps = state => ({ userEmail: state.getIn(['global', 'userData', 'email']) })
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Person)
