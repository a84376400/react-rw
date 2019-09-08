import React, {
  Component
} from 'react';
import IceContainer from '@icedesign/container';
import {
  Grid,
  Select,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Field,
  Feedback,
  moment
} from '@icedesign/base';
import UserService from '../../../../user.js';
import {
  FormBinderWrapper,
  FormBinder,
  FormError
} from '@icedesign/form-binder';
import fpmc from 'fpmc-jssdk';
import './CreateForm.css'

import _ from 'lodash';

const {
  Row,
  Col
} = Grid;
const Toast = Feedback.toast;

export default class extends Component {
  user = UserService.me().get(); //当前登录人信息

  index = this.props.index;
  isCreate = this.index == undefined;

  worksheetStatusOptions = [
    {
      label: '待处理',
      value: 'TODO',
    },
    {
      label: '已修复',
      value: 'FIXED',
    }
  ]
  constructor(props){
    super(props);
    this.state ={
      areaOptions : [], //区域
      deviceOptions : [],  //点位
      companyOptions : [], //运维单位
      staffOptions : [],  //运维人员

      value: {},

    }
  }

  componentDidMount(){

    this.getArea();
    this.getCompany();

    if(this.isCreate){
      this.getCode();
      return;
    }
    const { record } = this.props;
    const newValue = Object.assign( this.state.value, record );
    // newValue.setup_date = moment(parseInt(record.setup_date));
    this.setState({
      value: newValue,
    })
  }

  notRequiredIfCreate = () => {
    if(this.isCreate)
      return { };
    return { 'required': true }
  }

  disableIfCreate = () => {
    if(this.isCreate)
      return { 'disabled': true };
    return {}
  }

  getCode = () =>{
    new fpmc.Func('worksheet.createCode')
      .invoke()
      .then((data)=>{
        this.setState({
          worksheet_id : data
        })
      })
      .catch(console.error)
  }

  //获取区域
  getArea(){
    new fpmc.Query('dvc_area')
      .find()
      .then((list) => {
        const options = _.map(list, item => {
          return {
            label: item.name,
            value: item.id
          }
        });
        this.setState({
          areaOptions: options
        })
      })
      .catch(console.error);
  }

  //获取运维单位
  getCompany(){
    new fpmc.Query('usr_obs')
      .condition(`code = 'SUBCOMPANY'`)
      .find()
      .then((list) => {
        const options = _.map(list, item => {
          return {
            label: item.name,
            value: item.id
          }
        });
        this.setState({
          companyOptions: options
        })
      })
      .catch(console.error);
  }

  onChangeArea = (value) =>{
    //获取点位
    new fpmc.Query('dvc_device')
      .condition( { area_id: value } )
      .find()
      .then((list) => {
        const options = _.map(list, item => {
          return {
            label: item.name,
            value: item.sn
          }
        });
        this.setState( {
          deviceOptions: options
        } );
      })
      .catch(console.error);
  }

  onChangeCompany = (value) => {
    new fpmc.Query('usr_userinfo')
      .condition( { dept: value, enable: 1 } )
      .find()
      .then((list) => {
        const options = _.map(list, item => {
          return {
            label: item.nickname,
            value: item.id
          }
        });
        this.setState( {
          staffOptions: options
        } );
      })
      .catch(console.error);
  }

  formChange = value => {
    this.setState({ value });
  };

  reset = () => {
    if(this.isCreate){
      this.setState({ value: {} })
      this.getCode();
    }
  };

  handleSubmit = () =>{
    const { validateAll } = this.refs.form;
    validateAll((errors, values) => {
      if (!errors) {
        const { createOk, editOk, id, onClose } = this.props;
        const { company, device, duration, message, reason, remark, staff, status, troubleAt } = values;
        const row = {
          dispatcher_id: this.user.id,
          dispatchAt: _.now(),
          company_id: company,
          staff_id: staff,
          sn: device,
          code: this.state.worksheet_id,

          duration, message, reason, remark, status,
          troubleAt: troubleAt.getTime(),
        };

        if(this.isCreate){
          const obj = new fpmc.Object('opt_worksheet');
          obj.set(row)
            .create()
            .then((data) => {
              if(createOk){
                createOk(data.get());
              } else {
                Toast.success('添加成功');
                // TODO: reset the form?
              }
            }).catch(function(err){
                Toast.error(err.message || '系统错误,请稍后重试');
            });
        }else{
          // update

        }
      }
    });

  };

  render(){

    return(
      <div>
        <FormBinderWrapper
          value={this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.content}>
            <Row>
              <Col span="12">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>工单编号：</span>
                  <FormBinder name="code">
                    <Input
                      placeholder="工单编号" disabled
                      value={ this.state.worksheet_id }
                    />
                  </FormBinder>
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>设备区域：</span>
                  <FormBinder name="area" required message="请选择设备区域" >
                      <Select
                      style={ styles.block }
                      onChange= { (value) => {
                        this.onChangeArea(value);
                      }}
                      dataSource={ this.state.areaOptions}
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="area" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>运维单位：</span>
                  <FormBinder name="company" required message="请选择运维单位" >
                    <Select
                      style={ styles.block }
                      dataSource={ this.state.companyOptions }
                      onChange = { value => this.onChangeCompany(value) }
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="company" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障时间：</span>
                  <FormBinder name="troubleAt" required message="请选择故障时间" >
                    <DatePicker
                      style={ styles.block }
                      placeholder="请选择故障时间"
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="troubleAt" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障描述：</span>
                  <FormBinder name="message" required message="请输故障描述" >
                    <Input
                      placeholder="请输故障描述"
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="message" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障原因：</span>
                  <FormBinder name="reason" { ...this.notRequiredIfCreate() } message="请输故障原因" >
                    <Input
                      multiple
                      placeholder="请输故障原因"
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="reason" />
                </div>

              </Col>

              <Col span="12">

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>派单用户：</span>
                  <FormBinder name="user">
                    <Input
                      disabled
                      value={ this.user.nickname }
                      placeholder="请输入设备IP"
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="user" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>设备点位：</span>
                  <FormBinder name="device" required message="设备点位" >
                    <Select
                      style={ styles.block }
                      dataSource={ this.state.deviceOptions }
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="device" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>运维人员：</span>
                  <FormBinder name="staff" required message="请选运维人员：" >
                    <Select
                      style={ styles.block }
                      dataSource={ this.state.staffOptions }
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="staff" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>工单状态：</span>
                  <FormBinder name="status" required message="请选工单状态：：" >
                    <Select
                      style={ styles.block }
                      dataSource={ this.worksheetStatusOptions }
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="status" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>修复时长：</span>
                  <FormBinder name="duration" { ...this.notRequiredIfCreate() } message="请输入修复时长" >
                    <Input
                      { ...this.disableIfCreate() }
                      placeholder="请输入修复时长"
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="duration" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>其它备注：</span>
                  <FormBinder name="remark" >
                    <Input
                      multiple
                      placeholder="请输入备注"
                    />
                  </FormBinder>
                  <FormError style={styles.formItemError} name="remark" />
                </div>
              </Col>
            </Row>
          </div>
        </FormBinderWrapper>
      </div>
    )
  }
}


const styles = {
  formItem: {
    marginBottom: '20px'
  },
  formItemLeft: {
    marginBottom: '20px',
    textAlign: 'right',
  },
  formItemLabel: {
    width: '7em',
    height: '33px',
    lineHeight: '33px',
    display: 'inline-block',
    textAlign: 'right',
  },
  formItemError: {
    marginLeft: '8em',
    display: 'block',
  },
  block: {
    display: 'inline-block',
    width: '200px',
  }
}
