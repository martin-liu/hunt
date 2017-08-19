// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import search from './search.react';

const rootReducer = combineReducers({
  counter,
  search,
  router,
});

export default rootReducer;
