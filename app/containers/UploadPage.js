import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ResumeUpload from '../components/Upload.react';
import config from '../config/config';

function mapStateToProps(state) {
  return {
    api: config.api + 'resume'
  };
}

export default connect(mapStateToProps)(ResumeUpload);
