// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.scss';
import NoResult from './NoResult.react';
import { Layout, Icon, Input, Row, Col, Modal, Button, Card } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

import Util from '../utils/Util';

export default class Home extends Component {

  doSearch = _.debounce(this.props.search, 300);

  onChange(e) {
    if (_.trim(e.target.value) == this.props.query) return;

    this.doSearch(e.target.value);
  }

  isInitial() {
    return _.isUndefined(this.props.loading);
  }

  processData (data) {
    return _(data)
      .filter(d => d && d.document && d.document.id && d.document.raw)
      .map(d => {
        let id = d.document.id;
        let text = Util.encodeHtmlEntities(d.document.raw);
        text = Util.highlight(text, Util.processSearchQuery(this.props.query), (term) => `<span class="s-hl">${term}</span>`, 60);
        d.document.text = this.pretty(text);
        return d.document;
      })
      .value();
  }

  pretty(d) {
    return _.trim(d, '\n') || '';
  }

  renderBody() {
    let searchBodyContainer;
    if (!this.isInitial() && !this.props.loading) {
      let searchBody;
      if (this.props.results.length) {
        searchBody = _.map(this.processData(this.props.results), (d, i) => (
          <Row key={d.id} className={styles.search_item}>
            <div className={styles.search_item_header}>
              <span>#{i + 1}</span>
              <span>{d.contact.name}</span>
              <span>{d.contact.phone}</span>

              <span><a href={"mailto:" + d.contact.email}>{d.contact.email}</a></span>
              <Button type="primary"
                      style={{float: 'right'}}
                      onClick={() => this.props.showModal(d)}>
                Full Content

              </Button>
            </div>
            <hr/>
            <div dangerouslySetInnerHTML={{__html: d.text}} style={{whiteSpace: 'pre-wrap'}}></div>
          </Row>
        ));
      } else {
        searchBody = (
          <Row>
          <NoResult />
          </Row>
        );
      }

      searchBodyContainer = (
        <Row>
        <Col span={24} className={styles.search_body}>
        {searchBody}
        </Col>
          </Row>
      );
    }

    return searchBodyContainer;
  }

  renderModal() {
    let iconMap = {
      name: 'user',
      email: 'mail',
      phone: 'phone'
    };

    return _(this.props.modalData)
      .keys()
      .filter(k => !_.isString(this.props.modalData[k]))
      .map(k => {
        let v = this.props.modalData[k];
        let subCards = _(v)
          .keys()
          .map(kk => {
            let vv = v[kk];
            let title = iconMap[kk] ? (<Icon type={iconMap[kk]} />) : (<strong>{kk}: </strong>)
            let content = kk == 'email' ? (<a href={"mailto:" + vv}>{vv}</a>) : vv;
            return (vv || '').length < 60 ? (
              <p className={styles.detail_short_title}>
                {title}
                <span className={styles.detail_short_content}>{content}</span>
              </p>
            ) : (
              <Card key={kk} title={_.capitalize(kk)} bordered={false} style={{ width: '100%' }}>
                <div dangerouslySetInnerHTML={{__html: this.pretty(vv)}} style={{whiteSpace: 'pre-wrap'}}></div>
              </Card>
            )
          }).value();

        return subCards;
      })
      .value();
  }

  render() {
    let searchBodyContainer = this.renderBody();
    let modal = this.renderModal();

    return (
      <Layout>
        <Content>
          <Row>
            <Col span={24}>
              <Input autoFocus
                     placeholder="search..."
                     defaultValue={this.props.query}
                     className={styles.search}
                     style={{top: this.isInitial() ? '375px' : '44px'}}
                     suffix={this.props.loading ? <Icon type="loading" /> : <Icon type="search" />}
                     onChange={this.onChange.bind(this)}
                     onPressEnter={this.onChange.bind(this)}
              />
            </Col>
          </Row>
          {searchBodyContainer}

          <Modal
            className={styles.modal}
            title="Resume Detail"
            width="66.67%"
            visible={this.props.modalVisible}
            onOk={this.props.hideModal}
            onCancel={this.props.hideModal}
          >
            { modal }
          </Modal>
        </Content>
      </Layout>
    );
  }
}
