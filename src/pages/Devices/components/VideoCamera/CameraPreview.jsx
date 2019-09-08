import _ from 'lodash';
import React, {
  Component
} from 'react';
import {
  Button,
  Dialog,
  Feedback,
  Icon,

} from '@icedesign/base';
import IceLabel from '@icedesign/label';

import VideoCamera from '.';
import fpmc from 'fpmc-jssdk';

import CameraEditForm from './CameraEditForm.jsx';

const Toast = Feedback.toast;

export default class CameraPreview extends Component{
  
  constructor(props){
    super(props);
    this.state={
      visible: false, //弹窗
      preview: false, //预览视频
      info: this.props.info,
    }
  }

  // 关闭弹窗
  onFormClose = () =>{
    this.setState({
      visible : false,
    });
  }

  handleSubmit = () =>{
    const { handleSubmit } = this.refs.cameraForm;
    handleSubmit();
  }

  handleOnline = () => {
    this.setState({
      info: _.assign(this.state.info, { status: 'ONLINE' }),
    })
  }

  handleOffline = () => {
    this.setState({
      info: _.assign(this.state.info, { status: 'OFFLINE' }),
    })
  }
  
  // the callback handler of edit ok
  handleEditOK = ( data, index ) => {
    
    this.setState({
      info: data,
    })
    this.onFormClose();
    this.props.editOk && this.props.editOk(data, index);
  }

  //预览监控画面
  handlePreview = () =>{
    const { info } = this.state;
    if( info.status != 'ONLINE') {
      Toast.error('该监控设备不在线，无法预览');
      return;
    }
    this.setState({
      preview : true,
    });
  }

  //关闭监控画面
  handleShutPreview = () =>{
    this.setState({
      preview : false,
    });
  }

  render(){
    const { info } = this.state;
    const { record } = this.props
    
    return(
      <div style={styles.cameraBox}>
        <div style={ styles.cameraBtnBox }>
          <Button
            shape="text"
            style={styles.cameraBtn}
            onClick={ () => this.setState({ visible : true }) }
          >
            {record.name}
            <Icon type="ellipsis" size="large" style={{ color: "#FFA003" }} />
          </Button>
          {/* <Button
            shape="text"
            size="middle"
            onClick={ this.removeCamera }
          >
            <Icon type="delete-filling" size="large" style={{ color: "#DC143C" }} />
          </Button> */}
          
          <Dialog
            style={styles.dialog}
            visible={ this.state.visible }
            onOk={this.handleSubmit}
            closable="esc,mask,close"
            onCancel={this.onFormClose}
            onClose={this.onFormClose}
            autoFocus={false}
            title="编辑设备"
          >
            <CameraEditForm ref="cameraForm" { ...this.props }  online= { this.handleOnline} offline={this.handleOffline} editOk = { this.handleEditOK } onClose = { this.onFormClose }/>
          </Dialog>
          
        </div>
        {/* <img 
          src={require('./camera.png')}
          title="点击预览"
          style={styles.cameraImg}
          onClick={ this.handlePreview }
        /> */}
        <Dialog
          style={styles.dialog}
          visible={ this.state.preview }
          closable="esc,mask,close"
          footer={false}
          autoFocus={false}
          onClose={this.handleShutPreview}
          title= { '监控画面:' + info.name } 
        >
          <VideoCamera 
            user = { info.admin_name || 'admin' }
            pass = { info.admin_pass || 'admin123' } 
            streamId={info.id} 
            ip={info.ip} 
            brand={info.brand} 
            ch={info.channel} width="360"/>
        </Dialog>
        {/* <div style={styles.cameraTextBox}>
          <span>{info.name}</span>
          <span>{info.status == 'ONLINE' ? <IceLabel status="success">在线</IceLabel> : <IceLabel status="warning">离线</IceLabel>}</span>
        </div> */}
      </div>
    )
  }
}


const styles = {
  dialog:{
    width : 700,
  },
  cameraBox:{
    margin: '0px',
    textAlign:'center',
    //background:'#fafafa',
    //minHeight:'200px',
    padding:'0px'
  },
  cameraBtnBox:{
    
  },
  cameraImg:{
    width:'100px',
    marginTop:'20px',
    cursor:'pointer'
  },
  cameraTextBox:{
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    paddingTop:'20px'
  },
}