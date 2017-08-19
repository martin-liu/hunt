// @flow
import { ACTION_SEARCH, ACTION_SEARCH_RETURN } from '../actions/search.react';

export type searchStateType = {
  +query: string,
  +loading: boolean,
  +results: Array<any>
}

type searchActionType = {
  +type: string,
  +data: any
};

let initialState = {
  query: '',
  loading: false,
  results: []
}

export default function search(state: any = initialState, action: searchActionType) {
  switch (action.type) {
    case ACTION_SEARCH:
      return _.assign(_.clone(initialState), {query: action.query, loading: true});
    case ACTION_SEARCH_RETURN:
      return _.assign(_.clone(initialState), {results: action.data, loading: false});
    default:
      return state;
  }
}
