/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Form, Grid, Field, Feedback } from '@icedesign/base';

import fpmc from 'fpmc-jssdk';
import UserService from '../../../user.js';
import _ from 'lodash';
const FormItem = Form.Item;
const Toast = Feedback.toast;
const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;

export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: '',
        nickname: 'Test',
        email: 'test@test.com',
        mobile: '13333131333',
        dept: 1,
      },
    };
    this.field = new Field(this);
  }

  componentDidMount() {
    this.localInfo = UserService.me().load().get()
    const { id, nickname, email, mobile } = this.localInfo
    const userInfo = { nickname, email, mobile }
    this.id = id
    this.cloneInfo = _.cloneDeep(userInfo)
    this.field.setValues({ ...userInfo });
    this.setState({
      value: userInfo
    })
    
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  checkExistsIgnoreSelf = (field, value, callback) => {
    if(this.cloneInfo[field] === value){
      // unset
      callback()
      return;
    }
    if(value == ''){
      callback('必填');
      return;
    }
      new fpmc.Func('user.checkExists')
        .invoke({field, value})
        .then(data => {
          callback();
        })
        .catch(err => {
          callback('该信息已被占用');
        })
  }

  validateAllFormField = () => {
    this.field.validate((errors, values) => {
      if(errors){
        return;
      }
      // changeFile
      _.map(this.cloneInfo, (v, k) => {
        if(values[k] === v){
          delete values[k]
        }
      })
      if(_.isEmpty(values)){
        //Nothing changed
        return;
      }
      const o = new fpmc.Object('usr_userinfo', { id: this.id })
      o.save(values)
        .then(data => {
          Toast.success('修改成功')
          //save localstroage info
          UserService.me().update(_.assign(this.localInfo, values))
        })
        .catch(err => {
          Toast.error(err.message || '系统错误,请稍后重试');
        })
    });
  };

  render() {
    const { init, getError } = this.field;

    return (
      <div className="settings-form">
        <IceContainer>
        <div style={styles.formContent}>
          <h2 style={styles.formTitle}>基本设置</h2>
          <Form direction="ver" field={this.field} ref="form">
            <Row style={styles.formItem}>
              <Col xxs="6" s="4" l="3" style={styles.label}>
                姓名：
              </Col>
              <Col xxs="16" s="10" l="6">
                <Input size="large" 
                  {...init('nickname', {
                    rules: [
                      { required: true, message: '昵称不能为空'}
                    ]
                  })}
                />
                <span>{ getError("nickname") }</span>
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="4" l="3" style={styles.label}>
                邮箱：
              </Col>
              <Col xxs="16" s="10" l="6">
                <Input size="large" hasClear trim
                  {...init('email', {
                    rules: [ {
                      trigger: 'onBlur',
                      validator: 
                       (rule, values, callback) =>{
                          this.checkExistsIgnoreSelf(
                            'email',
                            values,
                            callback,
                            this.state.value
                          )
                        }
                    }]
                  })}
                />
                <span>{ getError("email") }</span>
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="4" l="3" style={styles.label}>
                手机：
              </Col>
              <Col xxs="16" s="10" l="6">
                <Input size="large" hasClear trim
                  {...init('mobile', {
                    rules: [ {
                      trigger: 'onBlur',
                      validator: 
                       (rule, values, callback) =>{
                          this.checkExistsIgnoreSelf(
                            'mobile',
                            values,
                            callback,
                            this.state.value
                          )
                        }
                    }]
                  })}
                />
                <span>{ getError("mobile") }</span>
              </Col>
            </Row>

          </Form>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
                style={{ width: 100 }}
                onClick={this.validateAllFormField}
              >
                提 交
              </Button>
            </Col>
          </Row>
          </div>
        </IceContainer>
      </div>
    );
  }
}
const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
