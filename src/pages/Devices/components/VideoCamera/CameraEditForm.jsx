import React, {
  Component
} from 'react';
import IceLabel from '@icedesign/label';
import {
  Grid,
  Input,
  Select,
  DatePicker,
  Feedback,
  moment,
  Button,
  Icon
} from '@icedesign/base';

import {
  FormBinderWrapper,
  FormBinder,
  FormError
} from '@icedesign/form-binder';

import fpmc, { Func } from 'fpmc-jssdk';
import _ from 'lodash';
import { color } from 'highcharts';

const {
  Row,
  Col
} = Grid;
const Toast = Feedback.toast;

export default class CameraEditForm extends Component{

  constructor(props){
    super(props);
    this.state = { 
      visible: false, //新建
      value: {  // default  value
        name : '',
        brand : 'haikang',
        setup_date : moment(_.now()),
        qa_length : 24,
        ip: '192.168.1.100',
        model : 'kakou',
        channel : 1,
        admin_name : 'admin',
        admin_pass : 'admin',
        token: '',
        camera_sn: '',
        status: 'OFFLINE',
      },
      ping: {
        loading: false,
      }
    };
    const { index } = this.props;
    this.index = index;
    this.isCreate = index == undefined;
    this.deviceBrand = [{
        label: '海康',
        value: 'haikang'
      },
      {
        label: '大华',
        value: 'dahua'
      },
      {
        label: '宇视',
        value: 'yushi'
      },
      {
        label: '易视',
        value: 'yishi'
      },
    ];
    this.cameraType = [{
        label: '卡口视频',
        value: 'kakou'
      },
      {
        label: '监控视频',
        value: 'jiankong'
      },
    ];
    this.outPutChannel = [{
        label: '通道1',
        value: '1'
      },
      {
        label: '通道2',
        value: '2'
      },
    ];
  }

  componentDidMount() {
    if(this.isCreate){
      return;
    }
    const { record } = this.props;
    const newValue = Object.assign( this.state.value, record );
    newValue.setup_date = moment(parseInt(record.setup_date));
    this.setState({
      value: newValue,
    })
    
  }

  stopBtnLoading = () => {
    this.setState({
      ping: { loading: false, disabled: false }
    })
  }

  startBtnLoading = () => {
    this.setState({
      ping: { loading: true, disabled: true }
    })
  }

  formChange = value => {
    this.setState({ value });
  };

	handleSubmit = async () =>{
    const { validateAll } = this.refs.form;
    validateAll(async (errors, values) => {
      if (!errors) {
        const { sn, createOk, editOk, id, onClose } = this.props;
        values.device_sn = sn;
        const { setup_date } = values;
        if(setup_date instanceof Date){
          values.setup_date = setup_date.getTime();
        }else{
          values.setup_date = setup_date._d.getTime();
        }
        try {
          if(this.isCreate){
            const obj = new fpmc.Object('dvc_camera');
            const data = await obj.set(values).create()
            Toast.success('添加成功');
            createOk && createOk(data.get());
          }else{
            // update
            const obj = new fpmc.Object('dvc_camera', { id });
            const data = await obj.save(values)
            Toast.success('修改成功');
            editOk && editOk(data.get(), this.index);
          }
          // 更新设备对应的 摄像头 ip 地址
          const rsp = await new Func('device.updateCameras')
            .invoke({
              sn,
            })
        } catch (error) {
          console.log(error)
          Toast.error(error.message || '系统错误,请稍后重试');
        }
        
        onClose && onClose();
        
      }
    });
  }
  
  removeCamera = () =>{
    const o = new fpmc.Object('dvc_camera');
    o.remove(this.props.id)
      .then(data => {
        Toast.success('删除成功');
        this.props.getCamera && this.props.getCamera()
      })
      .catch(err => {
        Toast.error(err.message || '系统错误,请稍后重试');
      })
  }

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
                  <span style={styles.formItemLabel}>设备名称：</span>
                  <FormBinder name="name" required message="请输入设备名称" >
                    <Input 
                      placeholder="请输入设备名称"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="name" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>安装时间：</span>
                  <FormBinder name="setup_date" required message="请选择安装日期" >
                    <DatePicker
                      style={ styles.block } 
                      placeholder="请输安装日期"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="setup_date" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>设备品牌：</span>
                  <FormBinder name="brand" required message="请输入品牌" >
                    <Select 
                      style={ styles.block }
                      dataSource={ this.deviceBrand}
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="brand" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>输出通道：</span>
                  <FormBinder name="channel" required message="请选择输出通道" >
                    <Select 
                      style={ styles.block }
                      dataSource={ this.outPutChannel }
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="brand" />
                </div>

              </Col>
              <Col span="12">

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>设备地址：</span>
                  <FormBinder name="ip" required message="请输入设备IP" >
                    <Input 
                      placeholder="请输入设备IP"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="ip" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>质保期限：</span>
                  <FormBinder name="qa_length" required message="请输入质保期(单位：月)" >
                    <Input 
                      placeholder="请输入质保期(单位：月)"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="qa_length" />
                </div>

                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>监控类型：</span>
                  <FormBinder name="model" required message="请输入监控类型" >
                    <Select 
                      style={ styles.block }
                      dataSource={ this.cameraType }
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="model" />
                </div>
                <div>
                  <Button onClick={this.removeCamera} style={{ background: '#FA7070' }}>
                    <IceLabel status="danger">删除设备</IceLabel>
                  </Button>
              </div>
             </Col>
            </Row>
            <IceLabel status="success">
              额外属性
            </IceLabel>
            <Row>
              <Col span="12">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>登录账号：</span>
                  <FormBinder name="admin_name" required message="请输入正确的登录账号" >
                    <Input 
                      placeholder="请输入登录账号"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="admin_name" />
                </div>
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>序列号：</span>
                  <FormBinder name="camera_sn">
                    <Input 
                      placeholder="请输入序列号"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="camera_sn" />
                </div>
              </Col>
              <Col span="12">
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>登录账号：</span>
                  <FormBinder name="admin_pass" required message="请输入正确的登录密码" >
                    <Input 
                      placeholder="请输入登录密码"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="admin_pass" />
                </div>
                <div style={styles.formItem}>
                  <span style={styles.formItemLabel}>验证码：</span>
                  <FormBinder name="token">
                    <Input 
                      placeholder="请输入验证码"
                    /> 
                  </FormBinder>
                  <FormError style={styles.formItemError} name="token" />
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