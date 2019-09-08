import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import './DataStatistics.scss';

const { Row, Col } = Grid;

const data = [
  {
    date: "12-1",
    value: 3
  },
  {
    date: "12-2",
    value: 4
  },
  {
    date: "12-3",
    value: 3.5
  },
  {
    date: "12-4",
    value: 5
  },
  {
    date: "12-5",
    value: 4.9
  },
  {
    date: "12-6",
    value: 6
  },
  {
    date: "12-7",
    value: 7
  },
  {
    date: "12-8",
    value: 9
  },
  {
    date: "12-9",
    value: 13
  }
];
const cols = {
  value: {
    min: 0
  },
  date: {
    range: [0, 1]
  }
};

const dataSource = {

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
    //{
      //name: '今日订阅',
      //value: '35623',
      //img: {
        //width: 28,
        //height: 27,
        //url: 'https://img.alicdn.com/tfs/TB1gDidceuSBuNjy1XcXXcYjFXa-56-54.png',
      //},
    //},
    //{
      //name: '今日评论',
      //value: '16826',
      //img: {
        //width: 28,
        //height: 26,
        //url: 'https://img.alicdn.com/tfs/TB1hDidceuSBuNjy1XcXXcYjFXa-56-52.png',
      //},
    //},
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
          
          <Row wrap>
            <Col xxs="24" l="12">
              <h4 style={styles.title}>视频在线率</h4>
              <Chart height={400} data={data} scale={cols} forceFit>
                <Axis name="date" />
                <Axis name="value" />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="date*value" size={2} />
                <Geom
                  type="point"
                  position="date*value"
                  size={4}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1
                  }}
                />
              </Chart>
            </Col>
            <Col xxs="24" l="12">
              <h4 style={styles.title}>支撑系统完整率</h4>
              <Chart height={400} data={data} scale={cols} forceFit>
                <Axis name="date" />
                <Axis name="value" />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="date*value" size={2} />
                <Geom
                  type="point"
                  position="date*value"
                  size={4}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1
                  }}
                />
              </Chart>
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
