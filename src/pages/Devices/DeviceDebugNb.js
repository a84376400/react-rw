import React, {
  Component
} from 'react'
import {
  Input,
  Card,
  Button,
  Feedback,
  Switch
} from "@icedesign/base";
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import IceTitle from '@icedesign/title';
import fpmc, {
  Func
} from 'fpmc-jssdk';

const ButtonGroup = Button.Group;
const Toast = Feedback.toast;

class DeviceDebugNb extends Component{

  constructor(props) {
    super(props);
    this.state = { sn: '356566078301967', autoCrc16: false }
  }

  send = async () =>{
    let crc16 = ''
    if(this.state.autoCrc16){
      crc16 = await new Func('device.crc16').invoke({ data: this.state.data})
    }
    new Func('mqttclient.publish')
      .invoke({ topic: '$s2d/nb/youren/push', payload: `00000001000000010${this.state.sn}${this.state.data}${crc16}`, format: 'hex'})
      .then(function(data){
        Toast.success("指令已成功发送");
      }).catch(console.error)
  }
    
  render() {
    const breadcrumb = [
      { text: '设备管理', link: '' },
      { text: 'NB调试', link: '' },
    ];
    return (
      <div className="cate-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <IceContainer>
          <IceTitle>NB调试</IceTitle>
        
            <p><span>设备序号：</span> <Input style={{ width: 400 }} defaultValue="NB序号" value={this.state.sn} hasClear onChange={ val => this.setState({sn: val}) } size="large" /></p>
            <p><span>指令数据：</span> <Input style={{ width: 400 }} multiple defaultValue="fffedd28" value={this.state.data} hasClear  onChange={ val => this.setState({data: val}) } size="large" /></p>
            <div><span>自动校验：</span> <Switch checked={this.state.autoCrc16}  onChange={ () => { this.setState({ autoCrc16: !this.state.autoCrc16 })} } /></div>
            <div style={{ marginTop: 10 }}>
              <ButtonGroup>
                <Button type="primary" onClick={ this.send }>发送</Button>
              </ButtonGroup>
                
            </div>
        </IceContainer>
          

      </div>
    );
  }
}

export default DeviceDebugNb