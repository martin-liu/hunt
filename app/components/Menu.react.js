// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Button } from 'antd';
import { routes } from '../routes';

export default class HMenu extends Component {
  static contextTypes = { router: React.PropTypes.object }

  state = {
    collapsed: true,
    hidden: true
  }

  getCurrentLocation = () => {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      // navigated!
      console.log(this.props.location)
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  toggleHidden = () => {
    this.setState({
      hidden: !this.state.hidden
    });
  }

  render() {
    return (
      <div style={{ maxWidth: 240 }}>
        <Button type="primary" style={{ marginBottom: 16 }} onClick={this.toggleHidden}>
          <h1 style={{color: '#fff'}}>H</h1>
        </Button>
        <div onMouseEnter={this.toggleCollapsed}
             onMouseLeave={this.toggleCollapsed}
             style={{display: this.state.hidden ? 'none' : 'block'}}>
          <Menu
            defaultSelectedKeys={[this.getCurrentLocation()]}
            mode="inline"
            theme="light"
            inlineCollapsed={this.state.collapsed}
            >
            {
              routes.map(d => (
                <Menu.Item key={d.path}>
                  <Icon type={d.icon} />
                  <span>{d.title}</span>
                  <Link to={d.path}></Link>
                </Menu.Item>
              ))
            }
          </Menu>
        </div>
      </div>
    );
  }
}
