import React from 'react'

import './Letter.css'

export default function Letter({ letter, ...props }) {
  const {
    text,
    sender_name,
    sender_surname,
    sender_avatar,
    date
  } = letter

  const {
    msgId,
    getDialogWithId,
    interlocutorAvatar
  } = props

  let msgText =
    text.length - text.slice(0, 30).length ? 
      (msgText = `${text.slice(0, 30)}...`) :
      (msgText = text)
      
  const avatarBg = interlocutorAvatar && interlocutorAvatar[0] === '#' ?
    { backgroundColor: interlocutorAvatar } :
    { backgroundImage: `url(${interlocutorAvatar})` }

  return (
    <li
      className="letter"
      id={msgId}
      onKeyDown={e => e.keyCode === 13 && getDialogWithId(e.currentTarget.id)}
      onClick={e => getDialogWithId(e.currentTarget.id)}
      role="menuitem"
      tabIndex={0}
    >
      <div
        className="avatar"
        style={avatarBg}
      />
      <span className="letter-date">{date}</span>
      <p className="letter-text">
        <span className="user">
          {`${sender_name} ${sender_surname}:`}
        </span>
        {` ${msgText}`}
      </p>
    </li>
  )
}
