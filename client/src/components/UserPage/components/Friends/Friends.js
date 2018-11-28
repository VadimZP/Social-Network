import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment'
import { List } from 'immutable'
import { connect } from 'react-redux'
import uuid from 'uuid'

import { getUsersRequested, getLastUserRequested } from 'redux/modules/users'
import { fetchUserRequested } from 'redux/modules/global'
import { openModal } from 'redux/modules/modals'
import { sendMessageRequested } from 'redux/modules/messages'
import { sendFriendshipRequested } from 'redux/modules/friends'
import { removeFriendRequested } from 'redux/modules/friends'

import './Friends.css'
import Person from './components/Person/Person'

class Friends extends Component {
  static propTypes = {
    getUsersRequested: PropTypes.func.isRequired,
    getLastUserRequested: PropTypes.func.isRequired,
    fetchUserRequested: PropTypes.func.isRequired,
    sendMessageRequested: PropTypes.func.isRequired,
    sendFriendshipRequested: PropTypes.func.isRequired,
    removeFriendRequested: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    friends: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,
    users: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,
    idOfLastUserInDB: PropTypes.string,
    userId: PropTypes.string.isRequired,
    searchResult: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
    userData: ImmutablePropTypes.contains({
      id: ImmutablePropTypes.string,
      email: ImmutablePropTypes.string,
      password: ImmutablePropTypes.string,
      name: ImmutablePropTypes.string,
      surname: ImmutablePropTypes.string,
      gender: ImmutablePropTypes.string,
      birth: ImmutablePropTypes.string,
      avatar: ImmutablePropTypes.string
    }).isRequired
  }

  state = {
    componentBody: 'friends',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.searchResult !== prevState.searchResult) {
      return {
        searchResult: nextProps.searchResult,
      }
    }
    return null
  }

  componentDidMount() {
    const {
      userData,
      getUsersRequested,
      getLastUserRequested,
      users
    } = this.props

    getLastUserRequested(userData.get('id'))

    if (!users.size) {
      getUsersRequested(userData.get('id'), 0, 4)
    }
  }

  handleScroll = e => {
    const { users, idOfLastUserInDB } = this.props

    const usersListElem = document.querySelector('.users-list')
    const lastUserInCurrentlyDisplayed = users && users.toJS().pop().id

    if (usersListElem && lastUserInCurrentlyDisplayed !== idOfLastUserInDB) {
      const { userId, getUsersRequested } = this.props

      const from = users.size
      const amount = 4

      if (e.target.getBoundingClientRect().bottom ===
        document.querySelector('.users-list').lastChild.getBoundingClientRect().bottom
      ) {
        getUsersRequested(userId, from, amount)
      }
    }
  }

  render() {
    const {
      fetchUserRequested,
      users,
      sendFriendshipRequested,
      friends,
      openModal,
      removeFriendRequested,
      sendMessageRequested,
    } = this.props

    const {
      id,
      name,
      surname,
      avatar
    } = this.props.userData.toJS()

    const { componentBody, searchResult } = this.state

   
    
    let friendsList
    console.log(friendsList)
    if (searchResult.size) {
      friendsList = searchResult.toJS().map(friend => <Person user={friend} key={friend.id} />)
    } else if (friends) {
      friendsList = friends.toJS().map(friend => (
        <Person user={friend} key={friend.id}>
          <Fragment>
            <button
              type="button"
              className="button"
              onClick={() => openModal(sendMessageRequested.bind(null, friend.id, id, name, surname, avatar, moment().format('YYYY-MM-DD HH:mm:ss')
              ), true, 'Send')}
            >
              Send a message
            </button>
            <button
              type="button"
              className="button"
              onClick={() => openModal(removeFriendRequested.bind(null, friend.id, id))}
            >
              Remove from friends
            </button>
          </Fragment>
        </Person>
      ))
    }

    let usersList
    if (searchResult.size) {
      usersList = searchResult.toJS().map(user => <Person user={user} key={user.id} />)
    } else if (users) {
      usersList = users.toJS().map(user => {
        return (
          <Person user={user} key={user.id}>
            {!friendsList.find(friend => friend.key === user.id) ? (
              <button
                type="button"
                className="button"
                onClick={() => openModal(sendFriendshipRequested.bind(null, user.id, 'friendship', `${name} ${surname} wants to be your friend`, id, name, surname, avatar))}
              >
                Add to your friends
              </button>
            ) : <h2 className="your-friend">Your friend</h2>}
          </Person>
        )
      })
    }
    return (
      <Fragment>
        <nav className="navbar">
          <ul>
            <li
              role="menuitem"
              tabIndex={0}
              onKeyDown={e => e.keyCode === 13 && this.setState({ componentBody: 'friends' })}
              onClick={() => {
                this.setState({ componentBody: 'friends' })
                localStorage.setItem('searchUser', '')
                fetchUserRequested(localStorage.getItem('searchUser'))
              }}
              className={componentBody === 'friends' ? 'active' : ''}
            >
              Friends
            </li>
            <li
              role="menuitem"
              tabIndex={0}
              onKeyDown={e => e.keyCode === 13 && this.setState({ componentBody: 'users' })}
              onClick={() => {
                this.setState({ componentBody: 'users' })
                localStorage.setItem('searchUser', '')
                fetchUserRequested(localStorage.getItem('searchUser'))
              }}
              className={componentBody === 'users' ? 'active' : ''}
            >
              All Users
            </li>
          </ul>
        </nav>
        {componentBody === 'users' && (
          <Fragment>
            <input
              type="search"
              className="search-input"
              id="users-search"
              placeholder="Find a user"
              defaultValue={localStorage.getItem('searchUser')}
              onChange={(e) => {
                localStorage.setItem('searchUser', e.target.value.trim())
                fetchUserRequested(localStorage.getItem('searchUser'))
              }}
            />
            <ul className="users-list" onScroll={this.handleScroll}>{usersList}</ul>
          </Fragment>
        )}
        {componentBody === 'friends' && (
          <Fragment>
            <div className="input-wrapper">
              <input
                type="search"
                className="search-input"
                id="friends-search"
                placeholder="Find a friend"
                defaultValue={localStorage.getItem('searchUser')}
                onChange={(e) => {
                  localStorage.setItem( 'searchUser', e.target.value.trim() );
                  fetchUserRequested(localStorage.getItem('searchUser'))
                }}
              />
            </div>
            <ul className="friends-list">{friendsList}</ul>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

Friends.defaultProps = {
  searchResult: List(),
  idOfLastUserInDB: ''
}

const mapStateToProps = state => ({
  userData: state.getIn(['global', 'userData']),
  users: state.getIn(['users', 'listOfAll']),
  lastUser: state.getIn(['users', 'last']),
  searchResult: state.getIn(['global', 'searchResult']),
  friends: state.get('friends'),
  userId: state.getIn(['global', 'userData', 'id']),
  idOfLastUserInDB: state.getIn(['users', 'last', 'id'])
})

export default connect(
  mapStateToProps,
  {
    getUsersRequested,
    getLastUserRequested,
    fetchUserRequested,
    sendMessageRequested,
    sendFriendshipRequested,
    removeFriendRequested,
    openModal: (func, customModal, btnText) => openModal({
      id: uuid.v4(),
      btnText,
      customModal,
      onConfirm: (arg) => func(arg)
    })
  }
)(Friends)
