import React, { Component } from 'react';

import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { Grid } from '@icedesign/base';
import IceContainer from '@icedesign/container';

const { Row, Col } = Grid;

export default class StateChart extends Component {
  static displayName = 'StateChart';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="sales-stat-chart">
        <Row wrap gutter="20">
          <Col xxs="24" s="15" l="15">
            <IceContainer title="修复率">
              <Chart height={428} data={data} forceFit>
                 <Axis name="month" />
                <Axis name="value" />
                <Legend />
                <Tooltip crosshairs={{ type: 'line' }} />
                <Geom type="area" position="month*value" color="saler" />
              </Chart>
            </IceContainer>
          </Col>
          <Col xxs="24" s="9" l="9">
            <IceContainer title="江都区故障率">
              <Chart
                height={76}
                data={userData}
                forceFit
                padding={[0, 0, 0, 0]}
              >
                <Axis name="count" />
                <Tooltip crosshairs={{ type: 'y' }} />
                <Geom type="interval" position="month*count" />
              </Chart>
            </IceContainer>

            <IceContainer title="邗江区故障率">
              <Chart
                height={76}
                data={downloadData}
                forceFit
                padding={[0, 0, 0, 0]}
              >
                <Axis name="pv" />
                <Tooltip crosshairs={{ type: 'y' }} />
                <Geom type="interval" position="month*count" />
              </Chart>
            </IceContainer>

            <IceContainer title="广陵区故障率">
              <Chart height={76} data={pvData} forceFit padding={[0, 0, 0, 0]}>
                <Axis name="pv" />
                <Tooltip crosshairs={{ type: 'y' }} />
                <Geom type="interval" position="month*pv" />
              </Chart>
            </IceContainer>
          </Col>
        </Row>
      </div>
    );
  }
}

const data = [
  { saler: '运维1组', month: '5', value: 2502 },
  { saler: '运维1组', month: '6', value: 2635 },
  { saler: '运维1组', month: '7', value: 2809 },
  { saler: '运维1组', month: '8', value: 3268 },
  { saler: '运维1组', month: '9', value: 3400 },
  { saler: '运维1组', month: '10', value: 3334 },
  { saler: '运维1组', month: '11', value: 3347 },
  { saler: '运维2组', month: '5', value: 1106 },
  { saler: '运维2组', month: '6', value: 1107 },
  { saler: '运维2组', month: '7', value: 1111 },
  { saler: '运维2组', month: '8', value: 1766 },
  { saler: '运维2组', month: '9', value: 1221 },
  { saler: '运维2组', month: '10', value: 1767 },
  { saler: '运维2组', month: '11', value: 1133 },
  { saler: '运维3组', month: '5', value: 1163 },
  { saler: '运维3组', month: '6', value: 1203 },
  { saler: '运维3组', month: '7', value: 1276 },
  { saler: '运维3组', month: '8', value: 1628 },
  { saler: '运维3组', month: '9', value: 1547 },
  { saler: '运维3组', month: '10', value: 1729 },
  { saler: '运维3组', month: '11', value: 1408 },
  { saler: '运维4组', month: '5', value: 1200 },
  { saler: '运维4组', month: '6', value: 1200 },
  { saler: '运维4组', month: '7', value: 1200 },
  { saler: '运维4组', month: '8', value: 1460 },
  { saler: '运维4组', month: '9', value: 1230 },
  { saler: '运维4组', month: '10', value: 1300 },
  { saler: '运维4组', month: '11', value: 1300 },
];

const pvData = [
  {
    month: '5',
    pv: 100,
  },
  {
    month: '6',
    pv: 200,
  },
  {
    month: '7',
    pv: 400,
  },
  {
    month: '8',
    pv: 120,
  },
  {
    month: '9',
    pv: 10,
  },
  {
    month: '10',
    pv: 1030,
  },
  {
    month: '11',
    pv: 100,
  },
];

const userData = [
  {
    month: '5',
    count: 100,
  },
  {
    month: '6',
    count: 300,
  },
  {
    month: '7',
    count: 110,
  },
  {
    month: '8',
    count: 320,
  },
  {
    month: '9',
    count: 102,
  },
  {
    month: '10',
    count: 100,
  },
  {
    month: '11',
    count: 420,
  },
];
const downloadData = [
  {
    month: '5',
    count: 10,
  },
  {
    month: '6',
    count: 220,
  },
  {
    month: '7',
    count: 200,
  },
  {
    month: '8',
    count: 530,
  },
  {
    month: '9',
    count: 140,
  },
  {
    month: '10',
    count: 1030,
  },
  {
    month: '11',
    count: 130,
  },
];