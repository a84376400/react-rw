

import React, { Component } from 'react';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';
import ChangePasswordForm from './components/ChangePasswordForm';

export default class EditPassword extends Component {
  static displayName = 'EditPassword';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '个人设置', link: '' },
      { text: '修改密码', link: '#/user/pwd' },
    ];
    return (
      <div className="edit-password-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <ChangePasswordForm />
      </div>
    );
  }
}
