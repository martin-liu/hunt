// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Input } from 'antd';
const Search = Input.Search;

export default class Home extends Component {
  render() {
    return (
        <Search
      placeholder="input search text"
      style={{ width: 200 }}
      onSearch={value => console.log(value)}
        />
    );
  }
}
