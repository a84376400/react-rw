import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Select, Input, Feedback } from '@icedesign/base';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import fpmc from 'fpmc-jssdk';
import './Edit.css';

const { Row, Col } = Grid;
const { Option } = Select;
const Toast = Feedback.toast;

export default class Edit extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:{
        reason : this.props.content.reason,
        duration : this.props.content.duration,
        remark : this.props.content.remark,
        status : this.props.content.status
      },
      tip : true
    }
  }

  //故障原因 改变值时 将值传入state
  handleReasonChange(value){
    this.setState({
      data:{
        ...this.state.data,
        reason : value,
      }
    });
    
  }

  //修复时长 改变值时 将值传入state
  handleTimeChange(value){
    let reg = /^[0-9]*$/;

    if(reg.test(value)){
      this.setState({
        data:{
          ...this.state.data,
          duration : value,
        },
        tip : true
      });
    }else{
      this.setState({
        data:{
          ...this.state.data,
          duration : value,
        },
        tip : false
      });
    }
  }

  //备注 改变值时 将值传入state
  handleRemarksChange(value){
    this.setState({
      data:{
        ...this.state.data,
        remark : value,
      }
    });
  }

  //状态 改变值时 将值传入state
  handeleStatusChange(value){
    this.setState({
      data:{
        ...this.state.data,
        status : value,
      }
    });
  }

  handleSubmit = () => {

    this.props.handleSubmitOk(this.state.data,this.props.index);

    if(this.state.tip){
      const { id } = this.props.content;
      let obj = new fpmc.Object('opt_worksheet', { id });
          obj.save(this.state.data)
            .then(function(data){
              Toast.success('操作成功');
              
            }).catch(function(err){
              Toast.error(err.message || '系统错误,请稍后重试');
            });

      this.props.handleClose();
    }
  }
  

  render() {
    let moment = require('moment');
    const downTime = moment(this.props.content.toubleAt).format('YYYY-MM-DD HH:mm:ss'); //故障时间

    const dispatchTime = moment(this.props.content.dispatchAt).format('YYYY-MM-DD HH:mm:ss'); //派单时间
    return (
      <IceContainer>
        <Row className="edit-row">
          <Col span="4">
            <div>工单编号:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.code}</div>
          </Col>
          <Col span="4">
            <div>运维单位:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.company}</div>
          </Col>
        </Row>
        <Row className="edit-row">
          <Col span="4">
            <div>设备号:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.sn}</div>
          </Col>
          <Col span="4">
            <div>点位名称:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.name}</div>
          </Col>
        </Row>
        <Row className="edit-row">
          <Col span="4">
            <div>运维人员:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.staff}</div>
          </Col>
          <Col span="4">
            <div>联系方式:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.mobile}</div>
          </Col>
        </Row>
        <Row className="edit-row">
          <Col span="4">
            <div>工单状态:</div>
          </Col>
          <Col span="8">
          <div>
            {
              this.props.content.status =='FIXED'?(
                <IceLabel status="success">已处理</IceLabel>
              ):(
                <Select 
                  className='edit-select' 
                  onChange={this.handeleStatusChange.bind(this)}
                  defaultValue='TODO'
                >
                  <Option value='TODO'>待处理</Option>
                  <Option value='DOING'>处理中</Option>
                  <Option value='FIXED'>已处理</Option>
                </Select>
              )
            }
          </div>
          </Col>
        </Row>
        <Row className="edit-row">
          <Col span="4">
            <div>问题描述:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.message}</div>
          </Col>
          <Col span="4">
            <div>派单者:</div>
          </Col>
          <Col span="8">
            <div>{this.props.content.dispatcher}</div>
          </Col>
        </Row>
        <Row className="edit-row">
          <Col span="4">
            <div>故障时间:</div>
          </Col>
          <Col span="8">
            <div>{downTime}</div>
          </Col>
          <Col span="4">
            <div>派单时间:</div>
          </Col>
          <Col span="8">
            <div>{dispatchTime}</div>
          </Col>
        </Row>
        <Row className="edit-row">
          <Col span="4">
            <div>故障原因:</div>
          </Col>
          <Col span="8">
            <Input 
              className="edit-reason" 
              value={this.state.data.reason}
              onChange={this.handleReasonChange.bind(this)} 
            />
          </Col>
          <Col span="4">
            <div>修复时长:</div>
          </Col>
          <Col span="8">
            <Input 
              className="edit-time"
              value={this.state.data.duration}
              onChange={this.handleTimeChange.bind(this)}
            />小时
            {this.state.tip ? (
                ''
                ) : (
                <div style={{ color: "red" }}>
                  <span>修复时长请输入整数</span>
                </div>
                )}
          </Col>
        </Row>
        <div className="remarks-tit">备注:</div>
        <Input 
          multiple 
          className="edit-remarks"
          value={this.state.data.remark}
          onChange={this.handleRemarksChange.bind(this)}
        />
      </IceContainer>
    )
  }

}


