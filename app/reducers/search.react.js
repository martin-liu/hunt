// @flow
import {
  ACTION_SEARCH,
  ACTION_SEARCH_RETURN,
  ACTION_SHOW_MODAL,
  ACTION_HIDE_MODAL
} from '../actions/search.react';

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
  loading: undefined,
  results: []
}

export default function search(state: any = initialState, action: searchActionType) {
  switch (action.type) {
    case ACTION_SEARCH:
      return _.assign(_.clone(state), {query: action.query, loading: true});
    case ACTION_SEARCH_RETURN:
      return _.assign(_.clone(state), {results: action.data, loading: false});
    case ACTION_SHOW_MODAL:
      return _.assign(_.clone(state), {modalVisible: true, modalData: action.data});
    case ACTION_HIDE_MODAL:
      return _.assign(_.clone(state), {modalVisible: false});
    default:
      return state;
  }
}
