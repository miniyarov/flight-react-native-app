import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducer from './reducer'

let middleware = [thunk]

if (__DEV__) {
    middleware = [...middleware, logger]
}

export default function store(initialState) {
    return createStore(
        reducer,
        initialState,
        applyMiddleware(...middleware)
    )
}