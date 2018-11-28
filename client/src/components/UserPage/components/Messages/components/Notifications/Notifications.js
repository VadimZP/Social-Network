import React from 'react'
import { connect } from 'react-redux'
import './Notifications.css'

import { acceptFriendshipRequested, rejectFriendshipRequested } from 'redux/modules/messages'

const Notifications = ({ notifications, acceptFriendshipRequested, rejectFriendshipRequested, userDataId }) => (
  <ul className="notifications">
    {notifications.toJS().map((item, i) => (
      <li key={i} onClick={e => e.target.tagName === 'BUTTON' && e.currentTarget.remove()}>{item.text}
        <button type="button" onClick={() => acceptFriendshipRequested(item.sender_id, userDataId)}>Accept</button>
        <button type="button" onClick={() => rejectFriendshipRequested(item.sender_id, userDataId)}>Reject</button>
      </li>
    ))}
  </ul>
)

const mapStateToProps = state => ({
  notifications: state.getIn(['messages', 'notifications']),
  userDataId: state.getIn(['global', 'userData', 'id'])
})

export default connect(
  mapStateToProps,
  {
    acceptFriendshipRequested: (sender_id, receiver_id) => acceptFriendshipRequested(sender_id, receiver_id),
    rejectFriendshipRequested: (sender_id, receiver_id) => rejectFriendshipRequested(sender_id, receiver_id)
  }
)(Notifications)
