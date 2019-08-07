import { createStore, compose, applyMiddleware, combineReducers } from 'redux';

import count from 'store/reducers/count';

const initialState = {
  count: 0,
};

interface ExtendedWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; // eslint-disable-line
}

declare const window: ExtendedWindow;

const composeEnhancers =
  process.env.NODE_ENV === 'development' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line
    : compose;

const rootReducer = combineReducers({
  count,
});

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware()),
);

export interface StoreState {
  count: number;
}

export default store;
