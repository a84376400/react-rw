import React, { Component } from 'react';
import ProfileSettingsForm from './ProfileSettingsForm';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';

export default class ProfileSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '个人设置', link: '' },
      { text: '基本信息', link: '#/porfile' },
    ];
    return (
      <div className="basic-setting-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <ProfileSettingsForm />
      </div>
    );
  }
}
