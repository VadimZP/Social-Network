import { takeLatest, fork } from 'redux-saga/effects'

import {
  types as globalType, registerUser,
  signInUser,
  changeSettings,
  uploadAvatar,
  fetchUser
} from './modules/global'
import { types as usersType, fetchUsers, fetchLastUser } from './modules/users'
import { types as friendsType, fetchFriends, postFriendship, deleteFriend } from './modules/friends'
import { types as messagesType, fetchUserMsgs, sendMsg, fetchUserNotifics, acceptFriendship, rejectFriendship } from './modules/messages'

export default function* rootSaga() {
  yield [
    fork(takeLatest, globalType.FETCH_USER_REQUESTED, fetchUser),
    fork(takeLatest, globalType.USER_REGISTRATION_REQUESTED, registerUser),
    fork(takeLatest, globalType.USER_SIGN_IN_REQUESTED, signInUser),
    fork(takeLatest, globalType.CHANGE_SETTINGS_REQUESTED, changeSettings),
    fork(takeLatest, globalType.UPLOAD_AVATAR_REQUESTED, uploadAvatar),
    fork(takeLatest, usersType.GET_USERS_REQUESTED, fetchUsers),
    fork(takeLatest, usersType.GET_LAST_USER_REQUESTED, fetchLastUser),
    fork(takeLatest, friendsType.GET_FRIENDS_REQUESTED, fetchFriends),
    fork(takeLatest, friendsType.SEND_FRIENDSHIP_REQUESTED, postFriendship),
    fork(takeLatest, messagesType.GET_USER_MSGS_REQUESTED, fetchUserMsgs),
    fork(takeLatest, messagesType.GET_USER_NOTIFICS_REQUESTED, fetchUserNotifics),
    fork(takeLatest, messagesType.SEND_MSG_REQUESTED, sendMsg),
    fork(takeLatest, messagesType.ACCEPT_FRIENDSHIP_REQUESTED, acceptFriendship),
    fork(takeLatest, messagesType.REJECT_FRIENDSHIP_REQUESTED, rejectFriendship),
    fork(takeLatest, friendsType.REMOVE_FRIEND_REQUESTED, deleteFriend)
  ]
}
