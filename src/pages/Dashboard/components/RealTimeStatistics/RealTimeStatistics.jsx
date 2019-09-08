import React, { Component } from 'react';
import { Grid } from '@icedesign/base';

const { Row, Col } = Grid;

export default class RealTimeStatistics extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { c1, c21, c22, c3, c4 } = this.props.data;
    return (
      <Row wrap gutter="20">
        <Col xxs="24" s="12" l="6">
          <div style={{ ...styles.itemBody, ...styles.green }}>
            <div style={styles.itemTitle}>
              <p style={styles.titleText}>今日新增设备</p>
              <span style={styles.tag}>实时</span>
            </div>
            <div style={styles.itemContent}>
              <h2 style={styles.itemNum}>{ c1 }</h2>
              <div style={styles.itemMeta}>
              </div>
            </div>
          </div>
        </Col>
        <Col xxs="24" s="12" l="6">
          <div style={{ ...styles.itemBody, ...styles.lightBlue }}>
            <div style={styles.itemTitle}>
              <p style={styles.titleText}>运检签到</p>
              <span style={styles.tag}>实时</span>
            </div>
            <div style={styles.itemContent}>
              <h2 style={styles.itemNum}>{ c22}/{ c21}</h2>
              <div style={styles.itemMeta}>
              </div>
            </div>
          </div>
        </Col>
        <Col xxs="24" s="12" l="6">
          <div style={{ ...styles.itemBody, ...styles.darkBlue }}>
            <div style={styles.itemTitle}>
              <p style={styles.titleText}>7日故障率</p>
              <span style={styles.tag}>实时</span>
            </div>
            <div style={styles.itemRow}>
              <div style={styles.itemCol}>
                <h2 style={styles.itemNum}>{ c3 }%</h2>
              </div>
            </div>
          </div>
        </Col>
        <Col xxs="24" s="12" l="6">
          <div style={{ ...styles.itemBody, ...styles.navyBlue }}>
            <div style={styles.itemTitle}>
              <p style={styles.titleText}>30日故障率</p>
              <span style={styles.tag}>实时</span>
            </div>
            <div style={styles.itemRow}>
              <div style={styles.itemCol}>
                <h2 style={styles.itemNum}>{ c4 }%</h2>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

const styles = {
  item: {
    width: '25%',
    padding: '0 10px',
  },
  itemBody: {
    marginBottom: '20px',
    padding: '10px 20px',
    borderRadius: '4px',
    color: '#fff',
    height: '104px',
  },
  itemRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    position: 'relative',
  },
  titleText: {
    margin: 0,
    fontSize: '14px',
  },
  tag: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '12px',
    background: 'rgba(255, 255, 255, 0.3)',
  },
  itemNum: {
    margin: '16px 0',
    fontSize: '32px',
  },
  total: {
    margin: 0,
    fontSize: '12px',
  },
  desc: {
    margin: 0,
    fontSize: '12px',
  },
  green: {
    background: '#31B48D',
  },
  lightBlue: {
    background: '#38A1F2',
  },
  darkBlue: {
    background: '#7538C7',
  },
  navyBlue: {
    background: '#3B67A4',
  },
};
