import { fromJS } from 'immutable'
import { call, put } from 'redux-saga/effects'
import { getUsersRequest, getLastUserRequest } from 'utils/api'

// Actions
export const types = {
  GET_USERS_REQUESTED: 'social-network/users/GET_USERS_REQUESTED',
  GET_USERS_SUCCEED: 'social-network/users/GET_USERS_SUCCEED',
  GET_USERS_FAILED: 'social-network/users/GET_USERS_FAILED',
  GET_LAST_USER_REQUESTED: 'social-network/users/GET_LAST_USER_REQUESTED',
  GET_LAST_USER_SUCCEED: 'social-network/users/GET_LAST_USER_SUCCEED',
  GET_LAST_USER_FAILED: 'social-network/users/GET_LAST_USER_FAILED'
}

// Action Creators
export function getUsersRequested(id, start, end) {
  return {
    type: types.GET_USERS_REQUESTED,
    id,
    start,
    end
  }
}

export function getUsersSucceed(users) {
  return { type: types.GET_USERS_SUCCEED, users }
}

export function getUsersFailed() {
  return { type: types.GET_USERS_FAILED }
}

export function getLastUserRequested(id) {
  return {
    type: types.GET_LAST_USER_REQUESTED,
    id
  }
}

export function getLastUserSucceed(user) {
  return { type: types.GET_LAST_USER_SUCCEED, user }
}

export function getLastUserFailed() {
  return { type: types.GET_LAST_USER_FAILED }
}

const initialState = fromJS({
  listOfAll: [],
  last: null
})

export default function users(state = initialState, action) {
  switch (action.type) {
    case types.GET_USERS_REQUESTED:
      return state
    case types.GET_USERS_SUCCEED:
      return state.withMutations(s => {
        const allUsers = s.get('listOfAll')
        return s.set('listOfAll', allUsers.concat(fromJS(action.users)))
      })
    case types.GET_USERS_FAILED:
      return state
    case types.GET_LAST_USER_REQUESTED:
      return state
    case types.GET_LAST_USER_SUCCEED:
      return state.set('last', fromJS(action.user))
    case types.GET_LAST_USER_FAILED:
      return state
    default:
      return state
  }
}

// Sagas
export function* fetchUsers(action) {
  try {
    const result = yield call(getUsersRequest, action.id, action.start, action.end)
    const users = yield result.json()

    yield put(getUsersSucceed(users))
  } catch (error) {
    yield put(getUsersFailed())
  }
}

export function* fetchLastUser(action) {
  try {
    const result = yield call(getLastUserRequest, action.id)
    const user = yield result.json()

    yield put(getLastUserSucceed(user[0]))
  } catch (error) {
    yield put(getLastUserFailed())
  }
}
