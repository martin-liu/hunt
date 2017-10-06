// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home.react';
import * as SearchActions from '../actions/search.react';

function mapStateToProps(state) {
  return state.search;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SearchActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
