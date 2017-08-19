// @flow
import axios from 'axios';
import _ from 'lodash';
import config from '../config/config';

export const ACTION_SEARCH = 'ACTION_SEARCH';
export const ACTION_SEARCH_RETURN = 'ACTION_SEARCH_RETURN';

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
    axios.get(api + query)
         .then(ret => {
           /* search return */
           setTimeout( () => {
           dispatch({
             type: ACTION_SEARCH_RETURN,
             data: ret.data
           });
           }, 2000);
         });
  };
}
