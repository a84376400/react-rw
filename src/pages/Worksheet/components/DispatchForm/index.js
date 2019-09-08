import React, {
  Component
} from 'react';
import {
  Grid,
  Select,
  Input,
  DatePicker,
  Feedback,
  moment
} from '@icedesign/base';
import UserService from '../../../../user.js';
import {
  FormBinderWrapper,
  FormBinder,
  FormError
} from '@icedesign/form-binder';
import fpmc, { Query } from 'fpmc-jssdk';
import IceTitle from '@icedesign/title';

import _ from 'lodash';

const {
  Row,
  Col
} = Grid;
const Toast = Feedback.toast;

export default class extends Component {

  isCreate = true;
    
  user = UserService.me().get();   //当前登录人信息
  trouble = this.props.trouble; // 故障

  constructor(props){
    super(props);
    this.state = {
      area : {},    // 区域
      device : {},  //点位
      companyOptions : [],  //运维单位
      staffOptions : [],    //运维人员
      value: {},
      
    }
  }

  componentDidMount(){
    
    // get area info by the device sn
    const { sn } = this.trouble;

    // new Query('dvc_device')
    //   .select('area_id')
    //   .condition({ sn })
    //   .first()
    //   .then( row => {
    //     this.setState()
    //   })

    // get the company by the area

    // get the staff by the company
    this.getCompany();

    if(this.isCreate){
      this.getCode();
      return;
    }
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

  handleSubmit = () =>{
    const { validateAll } = this.refs.form;
    validateAll((errors, values) => {
      if (!errors) {
        const { createOk, id, onClose, index } = this.props;
        const { company, reason = '', remark = '', staff } = values;
        
        const row = {
          dispatcher_id: this.user.id,
          dispatchAt: _.now(),
          company_id: company,
          staff_id: staff,
          sn: this.trouble.sn,
          code: this.state.worksheet_id,
          message: this.trouble.message,
          reason, remark, 
          status: 'TODO', 
          trouble_id: this.trouble.id,
          troubleAt: this.trouble.createAt,
        };
        const obj = new fpmc.Object('opt_worksheet');
        obj.set(row)
          .create()
          .then((data) => {
            if(createOk){
              createOk(index, data.get());
            } else {
              Toast.success('派单成功');
            }
          }).catch(function(err){
              Toast.error(err.message || '系统错误,请稍后重试');
          });
        new fpmc.Object('opt_trouble', { id: this.trouble.id })
          .set({ status: 1 })
          .save()
          .catch(console.error);
      }
    });

  };

  render(){

    return(
      <div>
        <IceTitle>派单</IceTitle>
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
                  <span>{ this.state.worksheet_id }</span>
                </div>
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>点位名称：</span>
                  <span>{ this.trouble.device }</span>
                </div>
              </Col>

              <Col span="12">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>派单用户：</span>
                  <span>{ this.user.nickname }</span>
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障时间：</span>
                  <span>{ moment(this.trouble.createAt).format('YYYY-MM-DD HH:mm') }</span>
                </div>
              </Col>

            </Row>
            <Row>
              <Col span="24">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障描述：</span>
                  <span>{ this.trouble.message } </span>    
                </div>
              </Col>
            </Row>
            <Row>

              <Col span="12">
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