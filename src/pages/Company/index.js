import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import TabTable from './components/TabTable';
import Signin from './components/Signin';

export default class Company extends Component {

  render() {
    const breadcrumb = [
      { text: '运维管理', link: '' },
      { text: '运维单位', link: '#/operation/company' },
    ];
    return (
      <div className="basic-setting-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <TabTable />
      </div>
    );
  }
}

export { Signin };
