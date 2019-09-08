import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Feedback, Input } from '@icedesign/base';
import EditDialog from '../../Components/EditDialog';


const FormItem = Form.Item;
const Toast = Feedback.toast;

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class DeviceForm extends Component {
  static displayName = 'DeviceForm';

  static propTypes = {
    getFormValues: PropTypes.func,
  };

  static defaultProps = {
    getFormValues: f => f,
  }

  constructor(props) {
    super(props);
    this.field = new Field(this);
    this.fpmc = this.props.fpmc;
  }

  handleSubmit() {
    this.field.validate((errors) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      // 这里定义要操作的表名
      const tableName = 'dvc_device';
      const { name } = this.field.getValues();
      const { record } = this.props;
      const o = new this.fpmc.Object(tableName, { id: record.id });
      /* eslint-disable */
      o.save({ name })
        .then(data => {
          Toast.success('操作成功');
          this.props.handleSubmitOk(data.get(), this.props.index)
          this.setState({
            visible: false,
          });
        })
        .catch(err => {
          console.error(err)
          Toast.error(err.message || '系统错误,请稍后重试');
        })
    });
  };

  render() {
    const init = this.field.init;
    return (
      <Form direction="ver" field={this.field}>
        <FormItem label="名称：" {...formItemLayout}>
          <Input hasClear
            {...init('name', {
              rules: [{ required: true, message: '必填选项' }],
            })}
          />
        </FormItem>
      </Form>
    )
  }
}

const WrappeddeviceForm = EditDialog(DeviceForm);
export default WrappeddeviceForm;
