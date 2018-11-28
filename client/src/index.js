import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { saveState } from './redux/localStorage'
import configuredStore from './redux/configuredStore'

const store = configuredStore()

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Route path="/" component={App} />
      </Router>
    </Provider>,
    document.getElementById('root')
  )
}

render()

store.subscribe(() => saveState(store.getState()))
store.subscribe(() => render())

registerServiceWorker()
