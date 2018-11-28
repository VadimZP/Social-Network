import { fromJS } from 'immutable'
import { call, put } from 'redux-saga/effects'

import {
  getUserRequest,
  registerUserRequest,
  signInUserRequest,
  changeSettingsRequest,
  uploadAvatarRequest
} from 'utils/api'

// Actions
export const types = {
  FETCH_USER_REQUESTED: 'social-network/global/FETCH_USER_REQUESTED',
  FETCH_USER_SUCCEED: 'social-network/global/FETCH_USER_SUCCEED',
  FETCH_USER_FAILED: 'social-network/global/FETCH_USER_FAILED',
  USER_REGISTRATION_REQUESTED: 'social-network/global/USER_REGISTRATION_REQUESTED',
  USER_REGISTRATION_SUCCEED: 'social-network/global/USER_REGISTRATION_SUCCEED',
  USER_REGISTRATION_FAILED: 'social-network/global/USER_REGISTRATION_FAILED',
  USER_SIGN_IN_REQUESTED: 'social-network/global/USER_SIGN_IN_REQUESTED',
  USER_SIGN_IN_SUCCEED: 'social-network/global/USER_SIGN_IN_SUCCEED',
  USER_SIGN_IN_FAILED: 'social-network/global/USER_SIGN_IN_FAILED',
  UPLOAD_AVATAR_REQUESTED: 'social-network/global/UPLOAD_AVATAR_REQUESTED',
  UPLOAD_AVATAR_SUCCEED: 'social-network/global/UPLOAD_AVATAR_SUCCEED',
  UPLOAD_AVATAR_FAILED: 'social-network/global/UPLOAD_AVATAR_FAILED',
  CHANGE_SETTINGS_REQUESTED: 'social-network/global/CHANGE_SETTINGS_REQUESTED',
  CHANGE_SETTINGS_SUCCEED: 'social-network/global/CHANGE_SETTINGS_SUCCEED',
  CHANGE_SETTINGS_FAILED: 'social-network/global/CHANGE_SETTINGS_FAILED'
}

// Action Creators
export function fetchUserRequested(name) {
  return { type: types.FETCH_USER_REQUESTED, name }
}

export function fetchUserSucceed(user, requestPurpose) {
  return { type: types.FETCH_USER_SUCCEED, user, requestPurpose }
}

export function fetchUserFailed(user, requestPurpose) {
  return { type: types.FETCH_USER_FAILED, user, requestPurpose }
}

export function userRegistrationRequested(userData) {
  return { type: types.USER_REGISTRATION_REQUESTED, userData }
}

export function userRegistrationSucceed() {
  return { type: types.USER_REGISTRATION_SUCCEED }
}

export function userRegistrationFailed() {
  return { type: types.USER_REGISTRATION_FAILED }
}

export function userSignInRequested(email, password) {
  return { type: types.USER_SIGN_IN_REQUESTED, email, password }
}

export function userSignInSucceed(user) {
  return { type: types.USER_SIGN_IN_SUCCEED, user }
}

export function userSignInFailed() {
  return { type: types.USER_SIGN_IN_FAILED }
}

export function uploadAvatarRequested(formData) {
  return { type: types.UPLOAD_AVATAR_REQUESTED, formData }
}

export function uploadAvatarSucceed(img) {
  return { type: types.UPLOAD_AVATAR_SUCCEED, img }
}

export function uploadAvatarFailed() {
  return { type: types.UPLOAD_AVATAR_FAILED }
}

export function changeSettingsRequested(userData) {
  return { type: types.CHANGE_SETTINGS_REQUESTED, userData }
}

export function changeSettingsSucceed(updatedUserData) {
  return { type: types.CHANGE_SETTINGS_SUCCEED, updatedUserData }
}

export function changeSettingsFailed() {
  return { type: types.CHANGE_SETTINGS_FAILED }
}

const initialState = fromJS({
  openRoute: false,
  userData: {},
  userExists: false,
  isLogged: null,
  registrationRequestWasMade: false,
  registerSuccess: false
})

export default function global(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_USER_REQUESTED:
      return state
    case types.FETCH_USER_SUCCEED:
      return state.set('searchResult', fromJS(action.user))
    case types.FETCH_USER_FAILED:
      return state.set('searchResult', fromJS(action.user))
    case types.USER_REGISTRATION_REQUESTED:
      return state.set('registrationRequestWasMade', true)
    case types.USER_REGISTRATION_SUCCEED:
      return state.withMutations(s => s.set('registrationRequestWasMade', false).set('registerSuccess', true))
    case types.USER_REGISTRATION_FAILED:
      return state.withMutations(s => s.set('registrationRequestWasMade', false).set('registerSuccess', false))
    case types.USER_SIGN_IN_REQUESTED:
      return state
    case types.USER_SIGN_IN_SUCCEED:
      return state.withMutations(s => s.set('openRoute', true).set('userData', fromJS(action.user)).set('isLogged', true))
    case types.USER_SIGN_IN_FAILED:
      return state.withMutations(s => s.set('openRoute', false).set('isLogged', false))
    case types.CHANGE_SETTINGS_REQUESTED:
      return state
    case types.CHANGE_SETTINGS_SUCCEED:
      return state.setIn(['userData'], fromJS(action.updatedUserData))
    case types.CHANGE_SETTINGS_FAILED:
      return state
    case types.UPLOAD_AVATAR_REQUESTED:
      return state
    case types.UPLOAD_AVATAR_SUCCEED:
      return state.setIn(['userData', 'avatar'], action.img)
    case types.UPLOAD_AVATAR_FAILED:
      return state
    default:
      return state
  }
}

export function* fetchUser(action) {
  try {
    const result = yield call(getUserRequest, action.name)
    const user = yield result.json()

    if (!user.length) {
      yield put(fetchUserFailed(undefined))
      return
    }

    yield put(fetchUserSucceed(user))
  } catch (error) {
    yield put(fetchUserFailed(undefined))
  }
}

export function* registerUser(action) {
  try {
    const result = yield call(registerUserRequest, action.userData)
    const user = yield result.json()

    if (!user[0]) {
      yield put(userRegistrationFailed())
      return
    }
    yield put(userRegistrationSucceed(user))
  } catch (error) {
    yield put(userRegistrationFailed())
  }
}

export function* signInUser(action) {
  try {
    const result = yield call(signInUserRequest, action.email, action.password)
    const user = yield result.json()

    if (!user[0]) {
      yield put(userSignInFailed())
      return
    }
    yield put(userSignInSucceed(user[0]))
  } catch (error) {
    yield put(userSignInFailed())
  }
}

export function* changeSettings(action) {
  try {
    const result = yield call(changeSettingsRequest, action.userData)
    const userData = yield result.json()

    yield put(changeSettingsSucceed(userData[0]))
  } catch (error) {
    yield put(changeSettingsFailed())
  }
}

export function* uploadAvatar(action) {
  try {
    const result = yield call(uploadAvatarRequest, action.formData)
    const img = yield result.json()

    yield put(uploadAvatarSucceed(img))
  } catch (error) {
    yield put(uploadAvatarFailed())
  }
}
