import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import TabTable from './components/TabTable';

export default class AreaList extends Component {

  render() {
    const breadcrumb = [
      { text: '通用设置', link: '' },
      { text: '区域设置', link: '#/setting/area' },
    ];
    return (
      <div className="basic-setting-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <TabTable />
      </div>
    );
  }
}
