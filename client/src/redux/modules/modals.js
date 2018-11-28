import { fromJS } from 'immutable'

// Actions
export const types = {
  OPEN_MODAL: 'social-network/modal/OPEN_MODAL',
  CLOSE_MODAL: 'social-network/modal/CLOSE_MODAL'
}

// Action Creators
export function openModal(object) {
  const obj = fromJS({ object })
  return { type: types.OPEN_MODAL, obj }
}

export function closeModal(obj) {
  return { type: types.CLOSE_MODAL, obj }
}

const initialState = fromJS([])

export default function modals(state = initialState, action) {
  switch (action.type) {
    case types.OPEN_MODAL:
      return state.concat(action.obj)
    case types.CLOSE_MODAL:
      return state.filter(item => item.get('id') !== action.obj.id)
    default:
      return state
  }
}
