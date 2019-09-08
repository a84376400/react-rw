/* eslint react/no-string-refs:0 */
import _ from 'lodash';
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Select, Field, Form, Feedback } from '@icedesign/base';
import fpmc from 'fpmc-jssdk';

const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class UserCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      obs: {}
    };
    this.field = new Field(this);
  }

  componentWillMount() {
    // fetch the obs values
    const q = new fpmc.Query('usr_obs')
    q.condition(`code = 'SUBCOMPANY'`)
    q.find().then( rows => {
      let obs = {}
      rows.map( row => {
        let { id, name } = row
        obs[id] = { value: id, label: name, key: 'select_company_' + id }
      })
      this.setState( { obs } );
    })
    .catch(err => {
      Toast.error(err.message || '系统错误');
    })

  }

  checkPasswd = (rule, values, callback) => {
    if (!values) {
      callback('请输入新密码');
    } else if (values.length < 8) {
      callback('密码必须大于8位');
    } else if (values.length > 16) {
      callback('密码必须小于16位');
    } else {
      callback();
    }
  };

  checkPasswd2 = (values, callback) => {
    if (values && values !== this.field.getValue('password')) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  checkExists = (field, value, callback) => {
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

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        return;
      }
      delete values.rePassword;
      new fpmc.Func('user.create')
        .invoke(values)
        .then(data => {
          Toast.success('添加成功');
          const { id } = data;
          const department = this.state.obs[parseInt(values['dept'])].label
          data = { id, enable: 1, department }
          values = Object.assign(values, data)
          this.props.handleSubmitOk && this.props.handleSubmitOk(values)
          // close dialog
          this.props.handleClose()
        })
        .catch(err => {
          Toast.error(err.message || '系统错误');
        })
    });
  };

  render() {
    const { init, getError } = this.field;
    return (
      <div className="user-form">
        <IceContainer>
          <Form direction="ver" field={this.field} >
            <FormItem label="用户名：" {...styles.formItemLayout}>
              <Input
                size="large"
                placeholder="4-6位的字母或数字组成"
                {...init('username', 
                  { rules: [ 
                      { 
                        pattern: '^[a-zA-Z0-9_-]{4,16}$',
                        require: true,
                        message: '请输入合法的用户名',
                        trigger: 'onBlur'

                      },
                      { 
                        required: true,
                        trigger: 'onBlur',
                        validator:(rule,values,callback)=>{
                          this.checkExists( 'username', values, callback)
                        }
                      }
                    ]}
                )}
                            //     {...init('username', 
                            //     rules: [ { validator: (rule, values, callback) => {
                            //         this.checkExists( 'username', values, callback, this.state.value)
                            //       }
                            //     }],
                            //  })}
             />
            </FormItem>
            <FormItem label="昵称：" {...styles.formItemLayout}>
              <Input
                size="large"
                placeholder=""
                {...init('nickname', {
                  rules: [{ required: true, message: '必填选项', trigger: 'onBlur' }],
                })}
              />
            </FormItem>
            <FormItem label="手机：" {...styles.formItemLayout}>
              <Input
                size="large"
                placeholder=""
                {...init('mobile', {
                  rules: [ {
                      required: true, 
                      pattern : '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$',
                      message: '请输入有效的手机号',
                      trigger: 'onBlur',
                    },{ 
                    required: true, 
                    trigger: 'onBlur',
                    validator:  (rule, values, callback) =>{
                      this.checkExists( 'mobile', values, callback, this.state.value)
                    }
                  
                   }],
                })}
              />
            </FormItem>

            <FormItem label="所属公司：" {...styles.formItemLayout}>
              <Select
                style={{ width: '100%' }}
                size="large"
                placeholder="请选择..."
                dataSource={ _.values(this.state.obs) }
                {...init('dept')}
              />
            </FormItem>
            <FormItem label="新密码：" {...styles.formItemLayout}>
              <Input
                htmlType="password"
                size="large"
                placeholder="请输入新密码"
                {...init('password', {
                  rules: [{ trigger: 'onBlur', validator: this.checkPasswd, required: true }],
                })}
              />
            </FormItem>
            <FormItem label="新密码：" {...styles.formItemLayout}>
              <Input
                htmlType="password"
                size="large"
                placeholder="两次输入密码保持一致"
                {...init('rePassword', {
                  rules: [{ trigger: 'onBlur', validator: (rule, values, callback) =>
                    this.checkPasswd2(
                      values,
                      callback
                    ), required: true }],
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
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    marginBottom: 25,
  },
  formLabel: {
    height: '32px',
    lineHeight: '32px',
    textAlign: 'right',
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
