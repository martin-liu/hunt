// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.scss';
import { Layout, Icon, Input, Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

export default class Home extends Component {

  doSearch = _.debounce(this.props.search, 300);

  onChange(e) {
    this.doSearch(e.target.value);
  }

  render() {
    return (
      <Layout>
        <Content>
          <Row>
            <Col span={4}></Col>
            <Col span={16}>
              <Input autoFocus
                     defaultValue={this.props.query}
                     className={styles.search}
                     style={{top: this.props.results.length ? '0px' : '311px'}}
                     suffix={this.props.loading ? <Icon type="loading" /> : <Icon type="search" />}
                     onChange={this.onChange.bind(this)}
                     onPressEnter={this.onChange.bind(this)}
              />
            </Col>
            <Col span={4}></Col>
          </Row>
          <Row>
            <Col span={4}></Col>
            <Col span={16} className={styles.search_body}>
              {
                this.props.results.map(d => (
                  <Row key={d.document.id}>{d.document.text}</Row>
                ))
              }
            </Col>
            <Col span={4}></Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
