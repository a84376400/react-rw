import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import FilterTable from './components/FilterTable';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '工单管理', link: '' },
      { text: '工单列表', link: '#/worksheet/list' },
    ];
    return (
      <div className="cate-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <FilterTable />
      </div>
    );
  }
}

