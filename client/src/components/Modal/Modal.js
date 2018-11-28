import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import './Modal.css'
import { closeModal } from 'redux/modules/modals'

const MessageModal = ({ update }) => {
  return (
    <div
      contentEditable
      className="message-modal"
      onInput={e => update('messageText', e.target.innerText)}
    />
  )
}

MessageModal.propTypes = {
  update: PropTypes.func.isRequired
}

class Modal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    zIndex: PropTypes.number.isRequired,
    item: PropTypes.shape({
      btnText: PropTypes.string,
      customModal: PropTypes.bool,
      id: PropTypes.string,
      onConfirm: PropTypes.func
    }).isRequired
  }

  state = {}

  update = (propName, value) => {
    this.setState({ [propName]: value })
  }

  onClose = () => {
    const { item, onClose } = this.props
    if (item.onClose) {
      item.onClose()
      onClose(item)
    } else {
      onClose(item)
    }
  }

  onConfirm = (arg) => {
    const { item, onClose } = this.props
    if (item.onConfirm) {
      item.onConfirm(arg)
      onClose(item)
    }
  }

  render() {
    const { zIndex } = this.props
    const { btnText, customModal } = this.props.item
    const { messageText } = this.state

    return (
      <div className="modal-wrapper" style={{ zIndex: (zIndex + 1) * 10 }}>
        <div className="modal">
          {customModal ? <MessageModal update={this.update} /> : <div className="text">Are you sure to do this?</div>}
          <div className="buttons">
            <button
              type="button"
              className="modal-button"
              onClick={() => this.onConfirm(messageText)}
            >
              { btnText || 'Confirm' }
            </button>
            <button
              type="button"
              className="modal-button"
              onClick={() => this.onClose()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }
}

function Modals(props) {
  const modals = props.modals.toJS().map((item, i) => (
    <Modal
      item={item}
      key={i}
      zIndex={i}
      onClose={item => props.closeModal(item)}
    />
  ))

  return <div className="modals">{modals}</div>
}

const mapStateToProps = state => ({ modals: state.get('modals') })

const ModalContainer = connect(
  mapStateToProps,
  {
    closeModal
  }
)(Modals)
export default ModalContainer
