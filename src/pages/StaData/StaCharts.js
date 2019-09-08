import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import IceContainer from '@icedesign/container';
import FilterTable from './components/QueryTable';
import RealTime from './components/ChartsTable/RealTimeData';
import StateChart from "./components/ChartsTable/StateChart";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '数据统计', link: '' },
      { text: '报表统计', link: '#/workingon/stadata' },
    ];
    
    return (
      <div className="cate-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <FilterTable />
        <RealTime />
        <StateChart />
      </div>
    );
  }
}