import fpmc from 'fpmc-jssdk';
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid } from '@icedesign/base';
import $ from "jquery";
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

const { Row, Col } = Grid;


const totalData = [
  {
    label: '摄像头数量',
    value: '55464',
  },
  {
    label: '光端机数量',
    value: '24717',
  },
  {
    label: '传感器数量',
    value: '4274',
  },
  {
    label: '运维人员',
    value: '68',
  },
];

const todayData = [
  {
    label: '摄像头数量',
    value: '7995',
    img: require('../../../../../images/count.png'),
  },
  {
    label: '光端机数量',
    value: '1002',
    img: require('../../../../../images/repo.png'),
  },
  {
    label: '传感器数量',
    value: '735',
    img: require('../../../../../images/user.png'),
  },
  {
    label: '运维人员',
    value: '55',
    img: require('../../../../../images/builder.png'),
  },
];

const moData = [
  {"weibao":"维保1组","num":0,date:3.1},
  {"weibao":"维保1组","num":3,date:3.2},
  {"weibao":"维保1组","num":3,date:3.3},
  {"weibao":"维保1组","num":17,date:3.4},
  {"weibao":"维保1组","num":5,date:3.5},
  {"weibao":"维保1组","num":6,date:3.6},
  {"weibao":"维保1组","num":1,date:3.7},
  {"weibao":"维保1组","num":3,date:3.8},
  {"weibao":"维保1组","num":0,date:3.9},
  {"weibao":"维保1组","num":13,date:3.10},
  {"weibao":"维保1组","num":7,date:3.11},
  {"weibao":"维保1组","num":3,date:3.12},
  {"weibao":"维保2组","num":5,date:3.1},
  {"weibao":"维保2组","num":6,date:3.2},
  {"weibao":"维保2组","num":7,date:3.3},
  {"weibao":"维保2组","num":8,date:3.4},
  {"weibao":"维保2组","num":15,date:3.5},
  {"weibao":"维保2组","num":6,date:3.6},
  {"weibao":"维保2组","num":9,date:3.7},
  {"weibao":"维保2组","num":8,date:3.8},
  {"weibao":"维保2组","num":10,date:3.9},
  {"weibao":"维保2组","num":6,date:3.10},
  {"weibao":"维保2组","num":0,date:3.11},
  {"weibao":"维保2组","num":8,date:3.12},
];

export default class RealTimeData extends Component {
  static displayName = 'RealTimeData';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
   /* new fpmc.*/
    new fpmc.Func('')

  }


  render() {
    return (
      <Row gutter="20">
        <Col l="12">
          <IceContainer>
            <h4 style={styles.cardTitle}>每日故障数</h4>
            {/* 跟换一张报表 */}
            <div>
        <Chart height={235} data={moData} forceFit>
          <Tooltip
            showTitle={false}
            crosshairs={{
              type: "cross"
            }}
            itemTpl="<li data-index={index} style=&quot;margin-bottom:4px;&quot;><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}<br/>{value}</li>"
          />
          <Axis name="date" />
          <Axis name="num" />
          <Legend />
          <Geom
            type="point"
            position="date*num"
            color="weibao"
            opacity={0.65}
            shape="circle"
            sstartonZero="true"
            size={4}
            tooltip={[
              "weibao*num*date",
              (weibao, num, date) => {
                return {
                  name: weibao,
                  value: num + "(个), " + date + "(日)"
                };
              }
            ]}
          />
        </Chart>
      </div>
          </IceContainer>
        </Col>
        <Col l="12">
          <IceContainer>
            <h4 style={styles.cardTitle}>所有数据</h4>
            <Row wrap gutter="10">
              {totalData.map((item, index) => {
                return (
                  <Col key={index} style={{ background: 'red' }}>
                    <div style={styles.totalCard}>
                      <div style={styles.label}>{item.label}</div>
                      <div style={styles.value}>{item.value}</div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </IceContainer>
          <IceContainer>
            <h4 style={styles.cardTitle}>今日在线数据</h4>
            <Row wrap gutter="10">
              {todayData.map((item, index) => {
                return (
                  <Col key={index} style={{ background: 'red' }}>
                    <div style={styles.todayCard}>
                      <img src={item.img} alt="" style={styles.todayCardIcon} />
                      <div>
                        <div style={styles.label}>{item.label}</div>
                        <div style={styles.value}>{item.value}</div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </IceContainer>
        </Col>
      </Row>
    );
  }
}

const styles = {
  cardTitle: {
    margin: '0 0 20px',
    fontSize: '18px',
    paddingBottom: '15px',
    fontWeight: 'bold',
    borderBottom: '1px solid #eee',
  },
  totalCard: {
    maxWidth: '160px',
    padding: '10px',
    borderRadius: '4px',
    background: 'rgba(240,130,76,.8)',
    color: '#fff',
  },
  todayCard: {
    display: 'flex',
    alignItems: 'center',
  },
  todayCardIcon: {
    width: '36px',
    height: '36px',
    marginRight: '8px',
  },
  label: {
    height: '14px',
    lineHeight: '14px',
    marginBottom: '8px',
  },
  value: {
    height: '28px',
    lineHeight: '28px',
    fontSize: '28px',
    fontWeight: '500',
  },
};
