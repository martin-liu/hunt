// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

import { LocaleProvider, BackTop, DatePicker } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import HMenu from '../components/Menu.react';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <LocaleProvider locale={enUS}>
      <div>
        <HMenu />
        {this.props.children}
        <BackTop />
      </div>
      </LocaleProvider>
    );
  }
}
