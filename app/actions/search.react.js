// @flow
import axios from 'axios';
import _ from 'lodash';
import config from '../config/config';

export const ACTION_SEARCH = 'ACTION_SEARCH';
export const ACTION_SEARCH_RETURN = 'ACTION_SEARCH_RETURN';
export const ACTION_SHOW_MODAL = 'ACTION_SHOW_MODAL';
export const ACTION_HIDE_MODAL = 'ACTION_HIDE_MODAL';

let preSource;

export function search(query: string) {
  return (dispatch: (data: any) => void) => {
    query = _.trim(query);
    if (!query) return;

    /* notify searching */
    dispatch({
      type: ACTION_SEARCH,
      query
    });

    let api = config.api + 'search/';

    if (preSource) {
      /* cancel previous request */
      preSource.cancel('Cancel previous search request when new request coming');
    }

    preSource = axios.CancelToken.source();

    axios.get(api + query, {cancelToken: preSource.token})
         .then(ret => {
           /* search return */
           dispatch({
             type: ACTION_SEARCH_RETURN,
             data: ret.data
           });
         }).catch(e => {
           if (axios.isCancel(e)) {
             console.log('Request canceled: ', e.message);
           } else {
             throw e;
           }
         });
  };
}

export function showModal(data) {
  return {
    type: ACTION_SHOW_MODAL,
    data
  }
}

export function hideModal() {
  return {
    type: ACTION_HIDE_MODAL
  };
}
