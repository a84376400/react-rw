import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';
import './DataStatistics.scss';

const { Row, Col } = Grid;

const dataSource = {
  chartData: [
    { month: '扬西 1', users: 38 },
    { month: '扬西 2', users: 52 },
    { month: '扬西 3', users: 61 },
    { month: '扬北 1', users: 115 },
    { month: '扬北 2', users: 48 },
    { month: '扬北 3', users: 38 },
    { month: '扬东 1', users: 48 },
    { month: '扬东 2', users: 58 },
    { month: '扬东 3', users: 68 },
    { month: '扬南 1', users: 88 },
    { month: '扬南 2', users: 98 },
    { month: '扬南 3', users: 68 },
  ],
  statisticData: [
    {
      name: '今日新增设备',
      value: '18',
      img: {
        width: 35,
        height: 32,
        url: 'https://img.alicdn.com/tfs/TB1fTidceuSBuNjy1XcXXcYjFXa-70-64.png',
      },
    },
    {
      name: '运检签到',
      value: '31/33',
      img: {
        width: 30,
        height: 31,
        url: 'https://img.alicdn.com/tfs/TB1fnidceuSBuNjy1XcXXcYjFXa-60-62.png',
      },
    },
    {
      name: '7日故障率',
      value: '1.5%',
      img: {
        width: 35,
        height: 32,
        url: 'https://img.alicdn.com/tfs/TB11FFTcgmTBuNjy1XbXXaMrVXa-70-64.png',
      },
    },
    {
      name: '30日故障率',
      value: '1%',
      img: {
        width: 28,
        height: 28,
        url: 'https://img.alicdn.com/tfs/TB1h_1jcamWBuNjy1XaXXXCbXXa-56-56.png',
      },
    },
  ],
};

export default class DataStatistics extends Component {
  static displayName = 'DataStatistics';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const cols = {
      users: { tickInterval: 20 },
    };

    return (
      <div className="data-statistics">
        <IceContainer>
          <h4 style={styles.title}>区域运行时长</h4>
          <Row wrap>
            <Col xxs="24" l="16">
              <Chart
                height={300}
                padding={[40, 10, 40, 35]}
                data={dataSource.chartData}
                scale={cols}
                forceFit
              >
                <Axis name="month" />
                <Axis name="value" />
                <Tooltip crosshairs={{ type: 'y' }} />
                <Geom type="interval" position="month*users" />
              </Chart>
            </Col>
            <Col xxs="24" l="8">
              <ul style={styles.items}>
                {dataSource.statisticData.map((item, index) => {
                  return (
                    <li key={index} className="item-box" style={styles.itemBox}>
                      <div style={styles.itemIcon}>
                        <img
                          src={item.img.url}
                          style={{
                            width: item.img.width,
                            height: item.img.height,
                          }}
                          alt=""
                        />
                      </div>
                      <div style={styles.itemText}>
                        <div style={styles.name}>{item.name}</div>
                        <div style={styles.value}>{item.value}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Col>
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '100%',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    paddingBottom: '15px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '1px solid #eee',
  },
  items: {
    display: 'flex',
    flexDeriction: 'row',
    flexWrap: 'wrap',
    marginLeft: '30px',
  },
  itemBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    marginTop: '50px',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: '10px',
  },
  icon: {
    color: '#3FA1FF',
  },
  value: {
    color: '#1F82FF',
    fontSize: '20px',
  },
  name: {
    fontSize: '12px',
  },
};
