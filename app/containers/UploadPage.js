import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ResumeUpload from '../components/Upload.react';
import config from '../config/config';
import * as CounterActions from '../actions/counter';

function mapStateToProps(state) {
  return {
    api: config.api + 'resume'
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResumeUpload);
