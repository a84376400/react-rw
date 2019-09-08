import React, { Component } from 'react';
import {
  hashHistory,
  Link
} from 'react-router';
import IceContainer from '@icedesign/container';
import { Grid, moment } from '@icedesign/base';
import './LatestNews.scss';

import fpmc, { DBQuery } from 'fpmc-jssdk';

const { Row, Col } = Grid;

export default class LatestNews extends Component {

  constructor(props) {
    super(props);
    this.state = {
      troubles: [],
      worksheets: [],
    };
  }

  componentDidMount() {
    new DBQuery('opt_trouble')
      .page(1, 6)
      .sort('id-')
      // .consition('')
      .find()
      .then(list => {
        this.setState({
          troubles: list
        })
      })
    new DBQuery('opt_worksheet')
      .page(1, 6)
      .sort('updateAt-')
      // .consition('')
      .find()
      .then(list => {
        console.log(list)
        this.setState({
          worksheets: list
        })
      })
  }

  render() {
    const { troubles, worksheets } = this.state;
    return (
      <div className="latest-news" style={styles.container}>
        <Row wrap gutter="20">
          <Col xxs="24" s="12" l="12">
            <IceContainer style={styles.cardContainer}>
              <h3 style={styles.cardTitle}>
                最新故障
                <Link to={ '/trouble/list'} className="link"style={styles.more}>
                  更多
                </Link>
              </h3>
              <div style={styles.items}>
                { troubles.map((item, index) => {
                  return (
                    <div
                      className="link"
                      key={index}
                      style={styles.item}
                    >
                      <div style={styles.itemTitle}>{item.message}</div>
                      <div style={styles.itemTime}>{ moment(item.createAt).format('YYYY/MM/DD HH:mm:ss')}</div>
                    </div>
                  );
                })}
              </div>
            </IceContainer>
          </Col>
          <Col xxs="24" s="12" l="12">
            <IceContainer style={styles.cardContainer}>
              <h3 style={styles.cardTitle}>
                检修反馈 
                <Link to={ '/worksheet/list'} className="link"style={styles.more}>
                  更多
                </Link>
              </h3>
              <div style={styles.items}>
              { worksheets.map((item, index) => {
                  return (
                    <div
                      className="link"
                      key={index}
                      style={styles.item}
                    >
                      <div style={styles.itemTitle}>{item.remark}</div>
                      <div style={styles.itemTime}>{ moment(item.updateAt).format('YYYY/MM/DD HH:mm:ss')}</div>
                    </div>
                  );
                })}
              </div>
            </IceContainer>
          </Col>
        </Row>
      </div>
    );
  }
}

const styles = {
  cardContainer: {
    height: '286px',
    overflowY: 'auto',
  },
  cardTitle: {
    position: 'relative',
    margin: '0 0 10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  more: {
    position: 'absolute',
    right: 0,
    fontSize: '12px',
    color: '#666',
  },
  item: {
    position: 'relative',
    display: 'block',
  },
  itemTime: {
    position: 'absolute',
    right: 0,
    top: 6,
    fontSize: '12px',
  },
  itemTitle: {
    height: '34px',
    lineHeight: '34px',
    fontSize: '13px',
  },
  itemComment: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
  },
  commentTitle: {
    height: '28px',
    lineHeight: '28px',
    fontSize: '13px',
  },
  commentTime: {
    fontSize: '12px',
  },
  commentNum: {
    position: 'absolute',
    right: 0,
    top: 6,
    width: '24px',
    height: '24px',
    lineHeight: '24px',
    fontSize: '12px',
    textAlign: 'center',
    borderRadius: '50px',
    background: '#FF2851',
    color: '#fff',
  },
};
