import React from "react";
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
import IceContainer from '@icedesign/container';
import DataSet from "@antv/data-set";
import styles from './index.module.scss';

class Series extends React.Component {
  render() {
    const data = [
      {
        week: "周一",
        江都区: 7,
        开发区: 3
      },
      {
        week: "周二",
        江都区: 6,
        开发区: 4
      },
      {
        week: "周三",
        江都区: 9,
        开发区: 5
      },
      {
        week: "周四",
        江都区: 15,
        开发区: 8
      },
      {
        week: "周五",
        江都区: 14,
        开发区: 19
      },
      {
        week: "周六",
        江都区: 25,
        开发区: 12
      },
      {
        week: "周日",
        江都区: 22,
        开发区: 10
      },
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["江都区", "开发区"],
      // 展开字段集
      key: "city",
      // key字段
      value: "temperature" // value字段
    });
    console.log(dv);
    const cols = {
      week: {
        range: [0, 1]
      }
    };
    return (
      <div>
        <IceContainer  className={styles.container}>
          <h4  className={styles.title}>一周区域故障趋势图</h4>
          <Chart height={200} data={dv} scale={cols} padding={[40, 40]} forceFit >
            <Legend position="top" textStyle={{fill:'#ffffff'}}/>
            <Axis name="week" label={{textStyle:{fill:'#ffffff'}}}/>
            <Axis
              name="temperature"
              label={{
                textStyle:{fill:'#ffffff'},
                formatter: val => `${val}`
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="line"
              position="week*temperature"
              size={2}
              color={"city"}
            />
            <Geom
              type="point"
              position="week*temperature"
              size={4}
              shape={"circle"}
              color={"city"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>
        </IceContainer>
        
      </div>
    );
  }
}

export default Series;
