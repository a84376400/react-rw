/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Feedback, Input, Field, Form } from '@icedesign/base';

import fpmc, { DBObject, Func } from 'fpmc-jssdk';

const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class SettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.field = new Field(this);
    this.isCreate = true;
    this.index = -1;
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if(errors){
        return;
      }
      //submit
      let obj, promise;
      if(this.isCreate){
        promise = new Func('staff.createCompany')
          .invoke(values)
      }else{
        const { address, phone, name, contact, id } = this.field.getValues();
        obj = new fpmc.Object('usr_obs', { id });
        promise = obj.save({name, phone, address, contact})
      }
      promise.then(data => {
        values.id = data.id;
        Toast.success('操作成功');
        this.props.handleSubmitOk && this.props.handleSubmitOk(values, this.index)
        // close dialog
        this.props.handleClose()
      })
      .catch(err => {
        Toast.error(err.message || '系统错误,请稍后重试');
      })
    });
  };

  componentWillMount() {
    if(this.props.record){
      // it means edit modify mode
      this.field.setValues({ ...this.props.record });
      this.index = this.props.index;
      this.isCreate = false;
    }
  }

  render() {
    const init = this.field.init;
    return (
      <div className="settings-form">
        <IceContainer>
          <Form direction="ver" field={this.field} >
            <FormItem label="名称：" {...styles.formItemLayout}>
              <Input
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="电话：" {...styles.formItemLayout}>
              <Input
                {...init('phone', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="联系人：" {...styles.formItemLayout}>
              <Input
                {...init('contact', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="地址：" {...styles.formItemLayout}>
              <Input
                {...init('address', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
          </Form>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  formItemLayout: {
    labelCol: {
      fixedSpan: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }
};
