import React, { Component } from 'react';
import CustomBreadcrumb from '../../Components/CustomBreadcrumb';
import TabTable from './TabTable';

export default class KpiComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '运检管理', link: '' },
      { text: '绩效考核', link: '#/workingon/kpi' },
    ];

    return (
      <div className="workingon-kpi-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <TabTable />
      </div>
    );
  }
}
