import React, { Component } from 'react';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';
import FilterTable from './FilterTable';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '故障处理', link: '' },
      { text: '告警记录', link: '#/trouble/alarm' },
    ];
    return (
      <div className="cate-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <FilterTable />
      </div>
    );
  }
}

