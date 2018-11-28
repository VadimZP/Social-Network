import { fromJS } from 'immutable'
import { call, put } from 'redux-saga/effects'
import openSocket from 'socket.io-client'

import { getUserMsgsRequest, sendMsgRequest, getUserNotificsRequest, acceptFriendshipRequest, rejectFriendshipRequest, getFriendsRequest } from 'utils/api'
import { types as friendsType } from './friends'

const socket = openSocket('http://192.168.1.100:8000')

// Actions
export const types = {
  GET_USER_MSGS_REQUESTED: 'social-network/messages/GET_USER_MSGS_REQUESTED',
  GET_USER_MSGS_SUCCEED: 'social-network/messages/GET_USER_MSGS_SUCCEED',
  GET_USER_MSGS_FAILED: 'social-network/messages/GET_USER_MSGS_FAILED',
  SEND_MSG_REQUESTED: 'social-network/messages/SEND_MSG_REQUESTED',
  SEND_MSG_SUCCEED: 'social-network/messages/SEND_MSG_SUCCEED',
  SEND_MSG_FAILED: 'social-network/messages/SEND_MSG_FAILED',
  GET_USER_NOTIFICS_REQUESTED: 'social-network/messages/GET_USER_NOTIFICS_REQUESTED',
  GET_USER_NOTIFICS_SUCCEED: 'social-network/messages/GET_USER_NOTIFICS_SUCCEED',
  GET_USER_NOTIFICS_FAILED: 'social-network/messages/GET_USER_NOTIFICS_FAILED',
  ACCEPT_FRIENDSHIP_REQUESTED: 'social-network/messages/ACCEPT_FRIENDSHIP_REQUESTED',
  ACCEPT_FRIENDSHIP_SUCCEED: 'social-network/messages/ACCEPT_FRIENDSHIP_SUCCEED',
  ACCEPT_FRIENDSHIP_FAILED: 'social-network/messages/ACCEPT_FRIENDSHIP_FAILED',
  REJECT_FRIENDSHIP_REQUESTED: 'social-network/messages/REJECT_FRIENDSHIP_REQUESTED',
  REJECT_FRIENDSHIP_SUCCEED: 'social-network/messages/REJECT_FRIENDSHIP_SUCCEED',
  REJECT_FRIENDSHIP_FAILED: 'social-network/messages/REJECT_FRIENDSHIP_FAILED'
}

// Action Creators
export function getUserMsgsRequested(id) {
  return { type: types.GET_USER_MSGS_REQUESTED, id }
}

export function getUserMsgsSucceed(messages) {
  return { type: types.GET_USER_MSGS_SUCCEED, messages }
}

export function getUserMsgsFailed() {
  return { type: types.GET_USER_MSGS_FAILED }
}

export function sendMessageRequested(
  receiver_id,
  id,
  name,
  surname,
  avatar,
  date,
  message
) {
  return {
    type: types.SEND_MSG_REQUESTED,
    receiver_id,
    id,
    name,
    surname,
    avatar,
    date,
    message
  }
}

export function sendMsgSucceed(message) {
  socket.emit('appendMessage', message)
  return { type: types.SEND_MSG_SUCCEED, message }
}

export function sendMsgFailed() {
  return { type: types.SEND_MSG_FAILED }
}

export function getUserNotificationsRequested(id) {
  return { type: types.GET_USER_NOTIFICS_REQUESTED, id }
}

export function getUserNotificsSucceed(notifications) {
  return { type: types.GET_USER_NOTIFICS_SUCCEED, notifications }
}

export function getUserNotificsFailed() {
  return { type: types.GET_USER_NOTIFICS_FAILED }
}

export function acceptFriendshipRequested(sender_id, receiver_id) {
  return { type: types.ACCEPT_FRIENDSHIP_REQUESTED, sender_id, receiver_id }
}

export function acceptFriendshipSucceed() {
  return { type: types.ACCEPT_FRIENDSHIP_SUCCEED }
}

export function acceptFriendshipFailed() {
  return { type: types.ACCEPT_FRIENDSHIP_FAILED }
}

export function rejectFriendshipRequested(sender_id, receiver_id) {
  return { type: types.REJECT_FRIENDSHIP_REQUESTED, sender_id, receiver_id }
}

export function rejectFriendshipSucceed() {
  return { type: types.REJECT_FRIENDSHIP_SUCCEED }
}

export function rejectFriendshipFailed() {
  return { type: types.REJECT_FRIENDSHIP_FAILED }
}

const initialState = fromJS({
  conversations: [],
  notifications: []
})

export default function messages(state = initialState, action) {
  switch (action.type) {
    case types.GET_USER_MSGS_REQUESTED:
      return state
    case types.GET_USER_MSGS_SUCCEED:
      return state.set('conversations', fromJS([...action.messages]))
    case types.GET_USER_MSGS_FAILED:
      return state
    case types.SEND_MSG_REQUESTED:
      return state
    case types.SEND_MSG_SUCCEED:
      return state.updateIn(['conversations'], arr => arr.push(action.message))
    case types.SEND_MSG_FAILED:
      return state
    case types.GET_USER_NOTIFICS_REQUESTED:
      return state
    case types.GET_USER_NOTIFICS_SUCCEED:
      return state.set('notifications', fromJS([...action.notifications]))
    case types.GET_USER_NOTIFICS_FAILED:
      return state
    case types.ACCEPT_FRIENDSHIP_REQUESTED:
      return state
    case types.ACCEPT_FRIENDSHIP_SUCCEED:
      return state
    case types.ACCEPT_FRIENDSHIP_FAILED:
      return state
    case types.REJECT_FRIENDSHIP_REQUESTED:
      return state
    case types.REJECT_FRIENDSHIP_SUCCEED:
      return state
    case types.REJECT_FRIENDSHIP_FAILED:
      return state
    default:
      return state
  }
}

// Sagas
export function* fetchUserMsgs(action) {
  try {
    const result = yield call(getUserMsgsRequest, action.id)
    const messages = yield result.json()

    yield put(getUserMsgsSucceed(messages))
  } catch (error) {
    yield put(getUserMsgsFailed())
  }
}

export function* sendMsg(action) {
  try {
    const result = yield call(sendMsgRequest, 
      action.receiver_id,
      action.id,
      action.name,
      action.surname,
      action.avatar,
      action.date,
      action.message,
    )

    const message = yield result.json()

    yield put(sendMsgSucceed(message))
  } catch (error) {
    yield put(sendMsgFailed())
  }
}

export function* fetchUserNotifics(action) {
  try {
    const result = yield call(getUserNotificsRequest, action.id)
    const notifications = yield result.json()

    yield put(getUserNotificsSucceed(notifications))
  } catch (error) {
    yield put(getUserNotificsFailed())
  }
}

export function* acceptFriendship(action) {
  try {
    const result = yield call(acceptFriendshipRequest, action.sender_id, action.receiver_id)


    yield put(acceptFriendshipSucceed())

    yield put({ type: friendsType.GET_FRIENDS_REQUESTED, id: action.receiver_id })
  } catch (error) {
    yield put(acceptFriendshipFailed())
  }
}

export function* rejectFriendship(action) {
  try {
    const result = yield call(rejectFriendshipRequest, action.sender_id, action.receiver_id)


    yield put(rejectFriendshipSucceed())
  } catch (error) {
    yield put(rejectFriendshipFailed())
  }
}
