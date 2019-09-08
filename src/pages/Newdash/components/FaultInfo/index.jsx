import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid } from '@alifd/next';
import './LatestNews.scss';
import styles from './index.module.scss';

const dataSource = {
  articles: [
    {
      title: '101柜门异常',
      time: '2018-03-31',
    },
    {
      title: '101柜门异常',
      time: '2018-02-02',
    },
    {
      title: '101柜门异常',
      time: '2018-01-22',
    },
    {
      title: '101柜门异常',
      time: '2018-02-02',
    },
    {
      title: '101柜门异常',
      time: '2018-01-22',
    },
    {
      title: '101柜门异常',
      time: '2018-02-02',
    },
  ]
};

const { Row, Col } = Grid;

export default class Index extends Component {
  static displayName = 'Index';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="latest-news">
        <Row wrap gutter={20}>
          <Col xxs="24" l="24">
            <IceContainer className={styles.cardContainer}>
              <h3 className={styles.cardTitle}>
                故障告警 :
                <a href="./#/newdash" className={`${styles.more} link`}>
                  更多
                </a>
              </h3>
              <div className={styles.items}>
                {dataSource.articles.map((item, index) => {
                  return (
                    <a
                      // className="link"
                      key={index}
                      href="./#/newdash"
                      className={`${styles.item} link`}
                    >
                      <div className={styles.itemTitle}>{item.title}</div>
                      <div className={styles.itemTime}>{item.time}</div>
                    </a>
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


