import React, { Component } from 'react';

export default class NoResult extends Component {
  render() {
    return (
      <div style={{
        fontSize: '14px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#999999',
        fontWeight: 'bold',
        margin: '10px 15px',
      }}>{this.props.text || 'No Result'}</div>
    );
  }
}
