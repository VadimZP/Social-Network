import { combineReducers } from 'redux-immutable'

import global from './global'
import users from './users'
import messages from './messages'
import modals from './modals'
import friends from './friends'

const rootReducer = combineReducers({
  global,
  users,
  friends,
  messages,
  modals
})

export default rootReducer
