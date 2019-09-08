/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Feedback, Input, Field, Form, Select } from '@icedesign/base';
import _ from 'lodash';
import fpmc, { Func, Query } from 'fpmc-jssdk';

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
        obj = new fpmc.Object('dvc_device', values);
        promise = obj.create()
      }else{
        const data = this.field.getValues();
        obj = new fpmc.Object('dvc_device', { id: data.id });
        delete data.id
        promise = obj.save(data)
      }
      promise.then(data => {
        Toast.success('操作成功');
        this.props.handleSubmitOk && this.props.handleSubmitOk(data.get(), this.index)
        // close dialog
        this.props.handleClose()
      })
      .catch(err => {
        Toast.error(err.message || '系统错误,请稍后重试');
      })
    });
  };

  async componentWillMount() {
    // get the area
    const data = await new Query('dvc_area').find();
    
    const options = _.map(data, item => {
      const { name, id } = item;
      return { label: name, value: id };
    });
    this.setState({
      areas: options,
    })

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
                placeholder="如: 1#智能箱"
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="SN：" {...styles.formItemLayout}>
              <Input
                {...init('sn', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="IP：" {...styles.formItemLayout}>
              <Input
                {...init('ip', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="经度：" {...styles.formItemLayout}>
              <Input
                {...init('gps_lat')}
              />
            </FormItem>
            <FormItem label="纬度：" {...styles.formItemLayout}>
              <Input
                {...init('gps_lng')}
              />
            </FormItem>
            <FormItem label="区域：" {...styles.formItemLayout}>
              <Select
                style={ styles.formItemLayout.block }
                placeholder="选择区域"
                dataSource={ this.state.areas }
                size="large"
                {...init('area_id')}
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
    block: {
      display: 'block',
    },
    labelCol: {
      fixedSpan: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }
};
