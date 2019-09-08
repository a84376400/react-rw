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
import DataSet from "@antv/data-set";
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';

class Groupedcolumn extends React.Component {
  render() {
    const data = [
      {
        name: "维保1",
        "江都区": 18.9,
        "开发区": 28.8,
        "广陵区": 39.3,
        "维扬区": 81.4,
      },
      {
        name: "维保2",
        "江都区": 12.4,
        "开发区": 23.2,
        "广陵区": 34.5,
        "维扬区": 99.7,
      },
      {
        name: "维保3",
        "江都区": 12.4,
        "开发区": 23.2,
        "广陵区": 34.5,
        "维扬区": 99.7,
      }
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["江都区", "开发区", "广陵区", "维扬区",],
      // 展开字段集
      key: "区域",
      // key字段
      value: "修复率" // value字段
    });
    return (
      <div>
        <IceContainer className={styles.container}>
          <h4 className={styles.title}>修复率考核</h4>
          <Chart height={200} data={dv} padding={[40, 40]} forceFit>
            <Axis name="区域" label={{textStyle:{fill:'#ffffff'}}}/>
            <Axis name="修复率" label={{textStyle:{fill:'#ffffff'}}}/>
            <Legend position="top" textStyle={{fill:'#ffffff'}}/>
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="interval"
              position="区域*修复率"
              color={"name"}
              adjust={[
                {
                  type: "dodge",
                  marginRatio: 1 / 32
                }
              ]}
            />
          </Chart>
        </IceContainer>
      </div>
    );
  }
}

export default Groupedcolumn;
