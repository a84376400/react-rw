import React, { Component } from 'react';
import _ from 'lodash'

import {
  Input,
  Card,
  Button,
  Feedback,
  Switch,
  Step,
  Grid,
  Icon,
  Dialog
} from "@icedesign/base";
import IceLabel from '@icedesign/label';
import UserService from '../user.js';
import fpmc, {
  Func,
  Query
} from 'fpmc-jssdk';
import { send, async } from 'q';

const Toast = Feedback.toast;
export default class RebootTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restarting: false,
      cameraValue: 0,
      disabled: true,
      time: 0,
    }
  }
  
  restart = () =>{
    new Func('device.send').invoke({ sn: this.props.sn, op: 'REBOOT', uid: UserService.me().getId()})
      .then(() => {
        Toast.success('设备重启中, 可能需要3-5分钟，请耐心等候.');
      })
      .catch(console.error)
  }

  handleFixMode = () => {
    /*在点击维修按钮之后将device fixing: 1 更新进数据库*/
   (this.props.setFixState)()
   new Func('device.updateDevice')
    .invoke({
      sn: this.props.sn,
      fixing: 1,
      op: 'fixing'
    })

    Dialog.confirm({
      content: "进入远程修复模式将无法收到后续的报警信息！是否继续?",
      title: "远程修复模式",
      onOk: async () => {
        try {
          // make the device in fix mode, then the device will not push error/alarm
          await new Func('device.send')
            .invoke({
              sn: this.props.sn,
              op: 'FIX_MODE',
              uid: UserService.me().getId()
            })

            this.setState({ disabled: false })
        } catch (error) {
          Toast.error(error.message || 'System Error!')
        }
      }
    });
  }
  

  doneFix = () =>{
    (this.props.removeFixState)()
    new Func('device.send').invoke({ sn: this.props.sn, op: 'RESET_MODE', uid: UserService.me().getId()})
      .then(() => {
        Toast.success('设备已回复正常的运行状态.');
        new Func('device.updateDevice').invoke({ sn: this.props.sn, fixing: 0,op: 'fixed'})
        this.setState({ disabled: true })
      })
      .catch(console.error)
  }

  restartGuangduanji = () =>{
    new Func('device.send').invoke({ sn: this.props.sn, unit: "0006", op : "SET", val: 2, uid: UserService.me().getId()})
      .then(() => {
        Toast.success('光端机重启中, 可能需要3-5分钟，请耐心等候.')
      })
      .catch(console.error)
  }

  render(){
    let timeChange;
    let ti = 5;
    //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
    const clock =()=>{
      if (ti > 0) {
        //当ti>0时执行更新方法
        ti = ti - 1;
        this.setState({
          time: ti
        })
      }else {
        //当ti=0时执行终止循环方法
        clearInterval(timeChange);
        /*将按钮能够显示*/
        this.setState({
          disabled: false,
          time: 0
        })
      }
    }
    const sendCode = ()=>{
      
      // if(this.state.device.status == 'ONLINE' || this.state.time > 0) return
      this.setState({
        disabled: true,
      });
      //每隔一秒执行一次clock方法
      timeChange = setInterval(clock,1000);
    }
    return (
      <div>
        <table >
          <tr>
            <td><Button shape="warning" onClick={this.handleFixMode} >开始检修</Button></td>
            <td><Button style={styles.buttonEnd} onClick={this.doneFix} >检修完成</Button></td>
          </tr>
          <tr height='55'>
            <td>摄像机重启</td>
            <td><Button type="secondary" disabled = {this.state.disabled}  onClick=
            {
              ()=>{
                this.props.restartCamera()
                sendCode()
            }
            }>{(this.state.time === 0)? '重启': this.state.time}</Button></td>
          </tr>
          <tr height='55'>
            <td>光端机重启</td>
            <td><Button type="secondary" disabled = {this.state.disabled}  onClick={ ()=>{this.restartGuangduanji() ; sendCode()} } >{(this.state.time === 0)? '重启': this.state.time}</Button></td>
          </tr>
          <tr height='55'>
            <td>终端机重启</td>
            <td><Button type="secondary" disabled = {this.state.disabled} onClick={ ()=>{this.restart(); sendCode()} } >{(this.state.time === 0)? '重启': this.state.time}</Button></td>
          </tr>
        </table>
      </div> 

    )
  }
}

const styles = {
  
  buttonEnd:{
    color: '#fff',
    background: 'green',
  }
}