import React, {
  Component
} from 'react';
import {
  Button,
  Icon,
  Dialog,
} from '@icedesign/base';


import CameraEditForm from './CameraEditForm.jsx';

export default class CameraAddDialog extends Component{

  constructor(props){
    super(props);
    this.state = {
      visible: false,
    };
  }

  // 弹窗
	onOpen = () => {
		this.setState({
			visible: true
		});
	};

	onClose = () => {
		this.setState({
			visible: false
		});
	};

	handleSubmit = () =>{
    const { handleSubmit } = this.refs.cameraForm;
    handleSubmit();
	}

	handleCreate = () =>{
    this.onOpen();
	}

  render(){
    return(
      <div style={styles.buttonBox}>
        <h4 style={{display: 'inline-block' ,marginRight: 324}}>摄像机</h4>
        <Button
          type="primary"
          size="large"
          style={styles.primaryButton}
          onClick={this.handleCreate}
        >
          <Icon type="add" />添加
        </Button>
        
        <Dialog
          style={styles.dialog}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          autoFocus={false}
          title="添加设备"
        >
          <CameraEditForm { ...this.props } onClose={ this.onClose } ref="cameraForm"/>
        </Dialog>
      </div>
    )
  }
}

const styles = {
  buttonBox:{
    textAlign:'center',
    float: 'right',
  },
  primaryButton: {
    color: '#fff',
  },
 
  dialog:{
    width : 700,
  },
}
