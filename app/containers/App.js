// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

import { LocaleProvider, BackTop, Layout, Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import enUS from 'antd/lib/locale-provider/en_US';
import HMenu from '../components/Menu.react';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Layout>
          <Row>
            <Col span={4}>
              <HMenu />
            </Col>
            <Col span={16} style={{top: '44px'}}>
              {this.props.children}
            </Col>
            <Col span={4}>
              <BackTop />
            </Col>
          </Row>
        </Layout>
      </LocaleProvider>
    );
  }
}
