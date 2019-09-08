import React, { Component } from 'react';
import _ from 'lodash';
import { Input, Form, Grid, Field, Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import EditDialog from './EditDialog';

const { Row, Col } = Grid;
const Toast = Feedback.toast;

class WrappedDialogForm extends Component {
  static displayName = 'WrappedDialogForm';

  constructor(props) {
    super(props);
    this.field = new Field(this);
    this.fpmc = this.props.fpmc;
  }

  handleSubmit = () => {
    this.field.validate((errors) => {
      if (errors) {
        Toast.error(errors.message || '请填写有效信息');
        return;
      }
      const formValues = this.field.getValues();
      const obj = new this.fpmc.Object('dvc_device');
      obj.set(formValues);
      obj.create().then((data) => {
        Toast.success('操作成功');
        this.props.handleSubmitOk(data.get());
      }).catch((err) => {
        Toast.error(err.message || '系统错误,请稍后重试');
      });
    });
  };

  checkExists = (rule, values, callback, message) => {
    const query = new this.fpmc.Query('dvc_device');
    const conditions = {};
    conditions[rule] = values;
    query.condition(conditions).count().then((countNum) => {
      if (countNum === 0) {
        callback();
        return;
      }
      callback(message);
    })
      .catch(console.log);
  }
  validateIp = (rule, value, callback) => {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (reg.test(value) == false) {
      callback('请输入有效IP');
      return;
    }
    callback();
  }

  render() {
    const FormItem = Form.Item;
    const { init } = this.field;
    return (
      <div className="user-form">
        <IceContainer>
          <Form direction="ver" field={this.field}>
            <Row>
              <Col>
                <FormItem label="区域名称: " {...styles.formItemLayout}>
                  <Input
                    size="large"
                    placeholder="输入区域或路名"
                    {...init('name', {
                      rules: [
                        {
                          trigger: 'onBlur',
                          validator: (rule, values, callback) => {
                            values = _.trim(values);
                            // 允许输入中文，英文，数字
                            values = values.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\.]/g,'');
                            if (_.isEmpty(values)) {
                              callback('必填');
                              return;
                            }
                           this.checkExists('name', values, callback, '该名称已经存在');
                          },
                        },
                      ],
                    })}
                  />
                </FormItem>
                <FormItem label="IP: "{...styles.formItemLayout}>
                  <Input
                    size="large"
                    placeholder="输入IP 地址"
                    {...init('ip', {
                      rules: [
                        {
                          trigger: 'onBlur',
                          validator: (rule, values, callback) => {
                            if (_.isEmpty(values)) {
                              callback('必填');
                              return;
                            }
                            this.validateIp('ip', values, (err) => {
                              if (err) {
                                callback(err);
                                return;
                              }
                              this.checkExists('ip', values, callback, '该IP 已经存在');
                            });
                          },
                        }],
                    })}
                  />
                </FormItem>
                <FormItem label="GPS: "{...styles.formItemLayout}>
                  <Input
                    size="large"
                    placeholder="输入GPS"
                    {...init('gps_lat', {
                      rules: [{
                        trigger: 'onBlur',
                        validator: (rule, values, callback) => {
                          if (_.isEmpty(values)) {
                            callback('必填');
                            return;
                          }
                         this.checkExists('gps_lat', values, callback, '该坐标已经存在');
                        },
                      }],
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
  },
  formItem: {
    marginBottom: 25,
  },
  formLabel: {
    height: '32px',
    lineHeight: '32px',
    textAlign: 'right',
  },
};

const WrappedDialogFormD = EditDialog(WrappedDialogForm);
export default WrappedDialogFormD;
