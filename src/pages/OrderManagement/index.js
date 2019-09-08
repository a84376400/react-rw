import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import TabTable from './components/TabTable';

export default class OrderList extends Component {

    render() {
      const breadcrumb = [
        { text: '通用设置', link: '' },
        { text: '指令管理', link: '#/setting/order' },
      ];
      return (
        <div className="basic-setting-page">
          <CustomBreadcrumb dataSource={breadcrumb} />
          <TabTable />
        </div>
      );
    }
  }