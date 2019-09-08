import Container from '@icedesign/container';
import React, { Component } from 'react';
import styles from './index.module.scss';

const staticDS = [
  {
    icon: require('./images/rw1.png'),
    title: '相机在线',
    total: '567/1567',
  },
  {
    icon: require('./images/rw2.png'),
    title: '终端点位',
    total: '80/800',
  },
  {
    icon: require('./images/rw3.png'),
    title: '运维人员',
    total: '89',
  },
  {
    icon: require('./images/rw4.png'),
    title: '今日告警',
    total: '20',
  },
  {
    icon: require('./images/rw5.png'),
    title: '今日修复',
    total: '20',
  },
  {
    icon: require('./images/rw6.png'),
    title: '当日派单',
    total: '20',
  },
  {
    icon: require('./images/rw7.png'),
    title: '未响应单',
    total: '20',
  },
];
class DataOverview extends Component {
  // state = {
  //   dataSource: [
  //     {
  //       icon: require('./images/rw1.png'),
  //       title: '相机在线',
  //       total: '567/1567',
  //     },
  //     {
  //       icon: require('./images/rw2.png'),
  //       title: '终端点位',
  //       total: '80/800',
  //     },
  //     {
  //       icon: require('./images/rw3.png'),
  //       title: '运维人员',
  //       total: '89',
  //     },
  //     {
  //       icon: require('./images/rw4.png'),
  //       title: '今日告警',
  //       total: '20',
  //     },
  //     {
  //       icon: require('./images/rw5.png'),
  //       title: '今日修复',
  //       total: '20',
  //     },
  //     {
  //       icon: require('./images/rw6.png'),
  //       title: '当日派单',
  //       total: '20',
  //     },
  //     {
  //       icon: require('./images/rw7.png'),
  //       title: '未响应单',
  //       total: '20',
  //     },
  //   ],
  // };
  constructor(props) {
    super(props);
    this.state = {
      dataSource: staticDS,
    };
    
  }

  componentDidMount(){
    const rows = [
      {
        icon: require('./images/rw1.png'),
        title: '相机在线',
        total: '67/567',
      },
      {
        icon: require('./images/rw2.png'),
        title: '终端点位',
        total: '8/80',
      },
      {
        icon: require('./images/rw3.png'),
        title: '运维人员',
        total: '89',
      },
      {
        icon: require('./images/rw4.png'),
        title: '今日告警',
        total: '20',
      },
      {
        icon: require('./images/rw5.png'),
        title: '今日修复',
        total: '20',
      },
      {
        icon: require('./images/rw6.png'),
        title: '当日派单',
        total: '20',
      },
      {
        icon: require('./images/rw7.png'),
        title: '未响应单',
        total: '20',
      },
    ];
    this.setState({
      dataSource: rows,
    });
  }

  render() {
    return (
      <Container className={styles.container}>
        {this.state.dataSource.map((data, index) => {
          return (
            <div key={index} className={styles.overviewItem}>
              <div className={styles.overviewItemIcon}>
                <img alt={data.title} src={data.icon} className={styles.width} />
              </div>
              <div className={styles.sy}>
                <div className={styles.overviewItemTitle}>{data.title}</div>
                <div className={styles.overviewItemTotal}>{data.total}</div>
              </div>
            </div>
          );
        })}
      </Container>
    );
  }
}

export default DataOverview;
