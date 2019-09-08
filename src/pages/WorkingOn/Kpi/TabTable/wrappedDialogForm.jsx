import React, { Component } from 'react';
import _ from 'lodash';
import { Input, Form, Grid, Field } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import EditDialog from './editDialog';

const { Row, Col } = Grid;

class WrappedDialogForm extends Component {
  static displayName = 'WrappedDialogForm';

  constructor(props) {
    super(props);
    this.field = new Field(this);
    this.fpmc = this.props.fpmc;
    this.UserService = this.props.UserService;
    this.Toast = this.props.Toast;
  }

  handleSubmit = (dd) => {
    this.field.validate((errors) => {
      if (errors) {
        this.Toast.error(errors.message || '请填写有效信息');
        return;
      }
      const memo = this.field.getValue('memo');
      const obj = new this.fpmc.Object('rw_checkin');
      obj.set({
        uid: this.UserService.me().get().username,
        year: dd.getFullYear(),
        month: dd.getMonth() + 1,
        day: dd.getDate(),
        dispath: 'null',
        memo,
      });
      obj.create().then((data) => {
        this.Toast.success('补打成功');
        this.props.handleSubmitOk(data.get());
      }).catch((err) => {
        this.Toast.error(err.message || '系统错误,请稍后重试');
      });
    });
  };

  render() {
    const FormItem = Form.Item;
    const { init } = this.field;
    return (
      <div className="user-form">
        <IceContainer>
          <Form direction="ver" field={this.field}>
            <Row>
              <Col>
                <FormItem label="请填写补打理由: " {...styles.formItemLayout}>
                  <Input
                    size="large"
                    placeholder="情况说明"
                    {...init('memo', {
                      rules: [
                        {
                          trigger: 'onBlur',
                          validator: (rule, values, callback) => {
                            if (_.isEmpty(values)) {
                              callback('必填');
                            } else {
                              callback();
                            }
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
