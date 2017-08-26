// @flow
import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  showUploadList: false,
  action: '',
};

export default class ResumeUpload extends Component {
  render() {
    props.action = this.props.api;
    props.onChange = (info) => {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        this.set
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };


    return (
      <div style={{ marginTop: 16, height: 180 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text" style={{color: '#fff'}}>Click or drag file to this area to upload</p>
        </Dragger>
      </div>
    )
  }
}
