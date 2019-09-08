import React, { Component } from 'react';
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label } from 'bizcharts';
import { DataView } from '@antv/data-set';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';

export default class Index extends Component {
  static displayName = 'Index';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // 参考：https://alibaba.github.io/BizCharts/
    const data = [
      { item: '江都区', count: 40 },
      { item: '开发区', count: 20 },
      { item: '广陵区', count: 15 },
      { item: '维扬区', count: 25 },
    ];

    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });

    const cols = {
      percent: {
        formatter: (val) => {
          val = `${val * 100}%`;
          return val;
        },
      },
    };

    return (
      <div className="chart-pie">
        <IceContainer className={styles.container}>
          <h4 className={styles.title}>故障区域占比图</h4>
          <Chart
            height={200}
            data={dv}
            scale={cols}
            padding={[0, 0, 0, 0]}
            forceFit
          >
            <Coord type="theta" radius={0.75} />
            <Axis name="percent" />
            <Legend position="right" offsetY={-1} offsetX={-80} textStyle={{fill:'#ffffff'}}/>
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                'item*percent',
                (item, percent) => {
                  percent = `${percent * 100}%`;
                  return {
                    name: item,
                    value: percent,
                  };
                },
              ]}
              style={{ lineWidth: 1, stroke: '#fff' }}
            >
              <Label
                content="percent"
                offset = {10}
                textStyle={{fill:'#ffffff'}}
                formatter={(val, item) => {
                  return `${val}`;
                }}
              />
            </Geom>
          </Chart>
        </IceContainer>
      </div>
    );
  }
}


