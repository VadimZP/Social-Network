import React from 'react'
import PropTypes from 'prop-types'

import './Home.css'
import { connect } from 'react-redux'

const Home = ({ location, userData }) => {
  const anotherProfile = location.state
  const {
    name,
    surname,
    birth,
    gender,
    country,
    avatar
  } = anotherProfile || userData.toJS()
  
  const avatarBg = avatar[0] === '#' ? { backgroundColor: avatar } : { backgroundImage: `url(${avatar})` }
  return (
    <header className="profile-header">
      <div className="avatar" style={avatarBg} />
      <div className="name-surname">
        {`${name} ${surname}`}
      </div>
      <ul className="info">
        <li className="age">
          <p>
            <span>Birthday: </span>
            {`${birth}`}
          </p>
        </li>
        <li className="gender">
          <p>
            <span>Gender: </span>
            {`${gender}`}
          </p>
        </li>
        <li className="location">
          <span>Location: </span>
          {`${country}`}
        </li>
      </ul>
    </header>
  )
}

const mapStateToProps = state => {
  return { userData: state.getIn(['global', 'userData']) }
}

export default connect(mapStateToProps)(Home)
