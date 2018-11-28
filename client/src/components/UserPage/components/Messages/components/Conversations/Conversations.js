import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import DialogContainer from './components/DialogContainer/DialogContainer'
import Dialog from './components/Dialog/Dialog'
import Letter from './components/Letter/Letter'

export default function Conversations({
  interlocutorId,
  dialogContent,
  getDialogWithId,
  userId,
  avatars,
  opts,
  keys
}) {

function compare(a, b) {
    if (a && b) {
      const lastDateA = a.slice(-1)[0].date.split(' ').join('T')
      const lastDateB = b.slice(-1)[0].date.split(' ').join('T')

      if (new Date(lastDateA).getTime() > new Date(lastDateB).getTime())
        return -1
      if (new Date(lastDateA).getTime() < new Date(lastDateB).getTime())
        return 1
    }
    return 0
  }

  return (
    <Fragment>
      <ul className="conversations">
        {opts.sort(compare).map((item, i) => (
          <Letter
            letter={item.slice(-1)[0]}
            msgId={item[0].receiver_id === userId ? item[0].sender_id : item[0].receiver_id}
            interlocutorAvatar={item[0].receiver_id === userId ? avatars[item[0].sender_id] : avatars[item[0].receiver_id]}
            getDialogWithId={getDialogWithId}
            key={keys[i]}
          />

        ))}
      </ul>
      {dialogContent.length ? (
        <DialogContainer interlocutorId={interlocutorId}>
          {dialogContent.map(item => {
            return <Dialog key={item.id} {...item} />
          })}
        </DialogContainer>
      ) : (
          <p>Select a dialog</p>
      )}
    </Fragment>
  )
}

Conversations.defaultProps = {
  dialogContent: []
}

Conversations.propTypes = {
  avatars: PropTypes.shape({ id: PropTypes.string }).isRequired,
  dialogContent: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    id: PropTypes.string,
    receiver_id: PropTypes.string,
    sender_avatar: PropTypes.string,
    sender_id: PropTypes.string,
    sender_name: PropTypes.string,
    sender_surname: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string
  })),
  getDialogWithId: PropTypes.func.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  opts: PropTypes.arrayOf(PropTypes.array).isRequired
}
