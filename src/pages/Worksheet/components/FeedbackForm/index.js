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

  constructor(props){
    super(props);
    this.state ={
      device : {},  //点位
      value: {},
    }
    const user = UserService.me().get()
    this.user = user;   //当前登录人信息
    this.index = this.props.index;
    this.worksheet = this.props.worksheet;

    this.statusOptions = [
      { label: '待处理', value: 'TODO' },
      { label: '处理中', value: 'DOING' },
      { label: '已完成', value: 'FIXED' },
      { label: '已关闭', value: 'CLOSED' },
    ]
  }

  componentDidMount(){
  
    // get the remark and the reason for the worksheet
    new fpmc.Object('opt_worksheet')
      .fields('reason,remark,status,duration')
      .getById(this.worksheet.id)
      .then(data => {
        this.setState({ value: data.get()})
      })
      .catch(console.error);

  }

  disableIfDone = () => {
    if(this.state.value.status == 'FIXED')
      return { 'disabled': true };
      if(this.state.value.status == 'CLOSED')
      return { 'disabled': true };
    return { 'disabled': false };
  }
  notRequiredIfNotFixed = () => {
    if(this.state.value.status == 'FIXED')
      return { 'required': true };
    return { 'required': false };
  }

  formChange = value => {
    this.setState({ value });
  };

  handleSubmit = () =>{
    const { validateAll } = this.refs.form;
    validateAll((errors, values) => {
      if (!errors) {
        const { handleSubmitOk, index } = this.props;
        
        const row = values;
        const obj = new fpmc.Object('opt_worksheet', { id: this.worksheet.id });
        obj.set(row)
          .save()
          .then((data) => {
            if(handleSubmitOk){
              handleSubmitOk(data.get(), index);
            } else {
              Toast.success('更新成功');
            }
            // not relate any trouble
            if(!this.worksheet.trouble_id){
              return;
            }
            let updateRow;
            // if status = 'FIXED' or 'CLOSED' update the trouble status
            switch(values.status){
              case 'TODO':
                return;
              case 'DOING':
                updateRow = { status: 1 };
                break;
              case 'FIXED':
                updateRow = { status: 2, fixAt: _.now() }
                break;
              case 'CLOSED':
                updateRow = { status: 1, fixAt: _.now() }
            }

            new fpmc.Object('opt_trouble', { id: this.worksheet.trouble_id })
              .set(updateRow)
              .save()
              .catch(console.error);
          }).catch(function(err){
              Toast.error(err.message || '系统错误,请稍后重试');
          });
          
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
                  <span>{ this.worksheet.code }</span>
                </div>
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>点位名称：</span>
                  <span>{ this.worksheet.name }</span>
                </div>
              </Col>

              <Col span="12">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>派单用户：</span>
                  <span>{ this.worksheet.dispatcher }</span>
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障时间：</span>
                  <span>{ moment(this.worksheet.troubleAt).format('YYYY-MM-DD HH:mm') }</span>
                </div>
              </Col>

            </Row>
            <Row>
              <Col span="24">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障描述：</span>
                  <span>{ this.worksheet.message } </span>    
                </div>
              </Col>
            </Row>
            <Row>

              <Col span="12">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>运维单位：</span>
                  <span>{ this.worksheet.company }</span>
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>工单状态：</span>
                  <FormBinder name="status" required message="请选择工单状态" >
                    <Select 
                      style={ styles.block }
                      dataSource={ this.statusOptions }
                      { ...this.disableIfDone() }
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="status" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>故障原因：</span>
                  <FormBinder name="reason" message="请输故障原因" >
                    <Input
                      multiple 
                      size="large"
                      placeholder="请输故障原因"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="reason" />
                </div>
              </Col>

              <Col span="12">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>运维人员：</span>
                  <span>{ this.worksheet.staff }</span>
                </div>
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>维修时长(H)：</span>
                  <FormBinder name="duration" { ...this.notRequiredIfNotFixed() } message="请输入维修时长" >
                    <Input 
                      placeholder="请输入维修时常(H)"
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
    marginBottom: '20px',
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