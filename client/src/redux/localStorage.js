import { fromJS } from 'immutable'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    const parsedState = JSON.parse(serializedState)
    return fromJS({...parsedState})
  } catch (error) {
    throw new Error(`loadState: ${error}`)
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    if (!state.getIn(['global', 'isLogged'])) {
      localStorage.clear()
      return
    }
    localStorage.setItem('state', serializedState)
  } catch (error) {
    throw new Error(`saveState: ${error}`)
  }
}
