import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import openSocket from 'socket.io-client'
import uuid from 'uuid'
import moment from 'moment'

import { sendMessageRequested } from 'redux/modules/messages'
import Dialog from '../Dialog/Dialog'

const socket = openSocket('http://192.168.1.100:8000')

class DialogContainer extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    interlocutorId: PropTypes.string.isRequired,
    sendMessageRequested: PropTypes.func.isRequired,
    userData: ImmutablePropTypes.contains(
      ImmutablePropTypes.contains({
        id: PropTypes.number,
        email: PropTypes.string,
        password: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string,
        gender: PropTypes.string,
        birth: PropTypes.string,
        avatar: PropTypes.string
      }).isRequired
    ).isRequired
  }

  state = {
    message: '',
    obj: {} 
  }

  componentDidMount() {
    socket.on(
      this.props.userData.get('id'),
      ({ receiver_id, sender_id, text, sender_name, sender_surname, date }) => {
        if (this.dialogContainerEl !== null) {
          const dialogContainerId = this.dialogContainerEl.id

          if (dialogContainerId === sender_id || dialogContainerId === receiver_id) {
            const elem = (
              <Dialog
                key={uuid.v4()}
                text={text}
                sender_id={sender_id}
                receiver_id={receiver_id}
                sender_name={sender_name}
                sender_surname={sender_surname}
                date={date}
              />
            )
             
            this.setState(prevState => {
              return prevState.obj[dialogContainerId] ? 
                { obj: { ...prevState.obj, [dialogContainerId]: [...prevState.obj[dialogContainerId], elem] } } :
                { obj: { ...prevState.obj, [dialogContainerId]: [elem] } }
            })
          }
        }
      }
    )
  }

  componentDidUpdate(prevProps) {
    if(prevProps.interlocutorId !== this.props.interlocutorId) {
      this.setState({obj: {}})
    }
  }

  writeMessage = e => {
    this.setState({ message: e.target.innerText })
  }

  sendMessage = () => {
    const { interlocutorId, sendMessageRequested } = this.props
    const { id, name, surname, avatar } = this.props.userData.toJS()
    const { message } = this.state
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')

    sendMessageRequested(interlocutorId, id, name, surname, avatar, currentDate, message)
  }

  render() {
    const { children, interlocutorId } = this.props
    const { obj } = this.state
    return (
      <div
        className="dialog-container"
        id={interlocutorId}
        ref={elem => (this.dialogContainerEl = elem)}
      >
        {children}
        {obj[interlocutorId]}
        <div className="message-bar">
          <button
            type="button"
            className="btn-submit-message"
            onClick={this.sendMessage}
          >
            Send
          </button>
          <div
            contentEditable
            style={{
              padding: '15px',
              width: '100%',
              background: '#fff',
              textAlign: 'left',
              borderTop: '1px solid #ADB5BD',
              outline: 'none'
            }}
            onInput={e => this.writeMessage(e)}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userData: state.getIn(['global', 'userData'])
})

export default connect(
  mapStateToProps,
  {
    sendMessageRequested
  }
)(DialogContainer)
