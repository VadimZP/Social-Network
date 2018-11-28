import React from 'react'

export default function Dialog({
  text,
  sender_name,
  sender_surname,
  date 
}) {
  return (
    <p className="dialog-message">
      <span className="dialog-user">
        {`${sender_name} ${sender_surname}: `}
      </span>
      {text}
      <span className="dialog-date">{date}</span>
    </p>
  )
}
