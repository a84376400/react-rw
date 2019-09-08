/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Feedback, Input, Grid, Field, Form } from '@icedesign/base';

import fpmc from 'fpmc-jssdk';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class extends Component {

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
        obj = new fpmc.Object('dvc_area', values);
        promise = obj.create()
      }else{
        const { name, id } = this.field.getValues();
        obj = new fpmc.Object('dvc_area', { id });
        promise = obj.save({name})
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
        <IceContainer title="派单">
          <Form labelAlign="top" direction="ver" field={this.field} >
            <Row>
              <Col span="12">
              <FormItem label="名称：" {...styles.formItemLayout}>
                <Input
                  {...init('name', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="派单人：" {...styles.formItemLayout}>
                <Input
                  {...init('派单人', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="名称：" {...styles.formItemLayout}>
                <Input
                  {...init('name', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="派单人：" {...styles.formItemLayout}>
                <Input
                  {...init('派单人', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="名称：" {...styles.formItemLayout}>
                <Input
                  {...init('name', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="派单人：" {...styles.formItemLayout}>
                <Input
                  {...init('派单人', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="名称：" {...styles.formItemLayout}>
                <Input
                  {...init('name', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="派单人：" {...styles.formItemLayout}>
                <Input
                  {...init('派单人', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>
              </Col>
            </Row>
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
