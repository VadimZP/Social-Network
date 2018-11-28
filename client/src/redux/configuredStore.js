import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'


import { loadState } from './localStorage'
import rootReducer from './modules/index'
import rootSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware()
const persistedState = loadState()
const middlewares = [sagaMiddleware, thunk]

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(...middlewares))
)

sagaMiddleware.run(rootSaga)

export default function configuredStore() {
  return store
}
