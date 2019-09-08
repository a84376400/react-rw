import React, {
  Component
} from 'react'
import {
  Switch,
  Grid,
  Card,
  Feedback,
  Input,
  Button,
  Range,
  Tree,
  Icon,
  Table,
  Checkbox,
  Tab,
  TimePicker,
  Field
} from '@icedesign/base';
import IceLabel from '@icedesign/label';
import IceTitle from '@icedesign/title';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import fpmc, {
  Func,
  Query,
  Object,
} from 'fpmc-jssdk';

import _ from 'lodash'
import { async } from 'q';
import { str } from 'gl-matrix/src/gl-matrix/vec4';

const ButtonGroup = Button.Group;
const Toast = Feedback.toast;
const {
  Row,
  Col
} = Grid;
const TabPane = Tab.TabPane;

const {
  Node: TreeNode
} = Tree;

export default class DeviceSetting extends Component{
  constructor(props) {
    super(props);
    // -1: no checked, 0: root checked.
    this.currentKey = -1;
    // default setting
    this.defaultValue = {
      temprature: {
        max: 30,
        min: -5,
      },
      // 电压
      voltage: {
        max: 240,
        min: 110,
      },
      // 电流
      electric: 800,
    }
    this.state = {
      temprature: {
        max: 30,
        min: -5,
      },
      // 电压
      voltage: {
        max: 240,
        min: 200,
      },
      time: {
        on: '',
        off: ''
      },
      // 电流
      electric: 100,

      // the json formatter string.
      setting: '',

      checkedKeys: [],
      // the setting of the id
      checkedSetting: {},
      checkStrictly: true,
      areas: []
    }
  }

  componentDidMount(){
    new Query('dvc_area')
      .find()
      .then( data => {
        const allAreas = _.map(data, d => {
          const { id, name } = d;
          return { id, title: name, setting: JSON.parse(d.setting) };
        })

        this.setState({
          areas: allAreas
        })
      })
  }

  saveSetting = async () => {
    // get the current setting
    const { voltage, temprature, electric, time } = this.state;
    const obj = new fpmc.Object('dvc_area', { id: this.currentKey });
    try{
      obj.set({ setting: JSON.stringify({ voltage, temprature, electric })});
      await obj.save();

    }catch(error){
      Toast.error(error.message || '系统错误');
    }

    // const { checkedKeys: keys } = this.state;
    await new Func('device.putSetting')
      .invoke( { maxT: temprature.max, minT: temprature.min, maxV: voltage.max/10, minV: voltage.min/10, maxE: electric, area: this.currentKey});
    await new Func('device.setTiming')
      .invoke( { Turntime: time.on, Offtime: time.off, area: this.currentKey } )
    }

  save = async () =>{
    const { checkedKeys: keys } = this.state;
    if(keys.length < 1){
      Toast.error('至少选择一个区域进行设置');
      return;
    }
    await this.saveSetting();
    Toast.success('设置成功!')
  }

  selfCheck = () =>{
    const { checkedKeys: keys } = this.state;
    if(keys.length < 1){
      Toast.error('至少选择一个设备进行设置');
      return;
    }
   new Func('device.selfCheck')
    .invoke({area: this.currentKey})
  }

  handleCheck = (keys, info) =>{
    const { eventKey, checked } = info.node.props;
    if(eventKey == '0'){
      return;
    }else{
      // only check one
      keys = [ eventKey ];
      this.currentKey = eventKey;
    }
    if(!checked){
      // fetch the setting by the checked id.
      new fpmc.Object('dvc_area')
        .getById(this.currentKey)
        .then( result => {
          const { data, objectId } = result;
          if(objectId._id == 'void'){
            // not setted. use the default Value
            this.setState(_.assign(this.state, this.defaultValue)); //将default Value的值拷贝到this.state中去
            return;
          }
          let { setting } = data;
          this.setState({ setting });
          setting = JSON.parse(setting);
          this.setState(_.assign(this.state, setting));
        })
    }

    this.setState({
      checkedKeys: keys
    });
  }


  render(){
    const breadcrumb = [
        { text: '设备管理', link: '' },
        { text: '参数设置', link: '#/devices/setting' },
      ];

    const { checkedKeys, checkStrictly } = this.state;
    return (
        <div className="dashboard-page">
          <CustomBreadcrumb dataSource={breadcrumb} />
          <IceContainer style={ { minHeight: '600px'}}>
            <Row wrap>
              <Col xxs="24" l="5">
              <IceTitle> 选择区域 </IceTitle>
                <Tree
                  defaultExpandAll
                  checkable
                  checkStrictly={ checkStrictly }
                  checkedKeys={checkedKeys}
                  onCheck={this.handleCheck}
                  >
                  <TreeNode label={'全部'} key={ '0'} disabled>
                    {
                      this.state.areas.map(item => {
                        return <TreeNode label={item.title} key={item.id} />
                      })
                    }
                  </TreeNode>
                </Tree>
              </Col>
              <Col xxs="24" l="3">
                <Button style={{ marginTop: '205px' }} shape={'warning'} onClick={this.selfCheck}>开始自检</Button>
              </Col>
              <Col xxs="24" l="16">
              <IceTitle> 设置参数 </IceTitle>
              <IceLabel style={ { marginBottom: '10px' } }status="danger" inverse={false}><Icon type="warning" style={{ marginRight: '10px' }} /> 参数无法对离线的设备设置，请确保设备在线或设备上线后再操作一次！</IceLabel>
                <Tab
                  type="wrapped"
                >
                  <TabPane tab="设置温度阀值" key="1">
                    <IceContainer>
                    <p>设置设备可工作的温度阀值，单位(°C)</p>
                    <div>

                    <Range
                      slider={"double"}
                      defaultValue={ [ this.defaultValue.temprature.min, this.defaultValue.temprature.max ] }
                      min = {-20 }
                      max = { 60 }
                      marks={ 10 }
                      value = { [ this.state.temprature.min, this.state.temprature.max ] }
                      onChange = { (value) => {
                        this.setState({
                          temprature:{
                            min: value[0],
                            max: value[1]
                          }
                        })
                      }}
                      tipFormatter = { value => value + '°C'}
                      style={styles.range} />
                    </div>
                    </IceContainer>
                  </TabPane>
                  <TabPane tab="电压阀值设置" key="2">
                  <IceContainer>
                    <p>设置设备正常工作的电压阀值，单位(V)</p>
                    <div>

                    <Range
                      slider={"double"}
                      defaultValue = { [ this.defaultValue.voltage.min, this.defaultValue.voltage.max ] }
                      min = { 100 }
                      max = { 260 }
                      marks={ 16 }
                      step = { 10 }
                      value = { [ this.state.voltage.min, this.state.voltage.max ] }
                      onChange = { (value) => {
                        this.setState({
                          voltage:{
                            min: value[0],
                            max: value[1]
                          }
                        })
                      } }
                      tipFormatter = { value => value + 'V'}
                      style={ styles.range } />
                    </div>
                    </IceContainer>
                  </TabPane>
                  <TabPane tab="电流阀值设置" key="3">
                  <IceContainer>
                    <p>设置设备正常工作的电流阀值，单位(mA)</p>
                    <div>

                    <Range
                      defaultValue={ this.defaultValue.electric }
                      min = { 0 }
                      max = { 1000 }
                      marks={ 5 }
                      step = { 100 }
                      value = { this.state.electric }
                      onChange = { (value) => {
                        this.setState({
                          electric: value
                        })
                      } }
                      tipFormatter = { value => value + 'mA'}
                      style={ styles.range } />
                    </div>
                    </IceContainer>
                  </TabPane>
                  <TabPane tab="补光灯定时设置" key="4">
                  <IceContainer>
                    <p>设置补光灯的定时开关，单位(min)</p>
                    <div>
                      <TimePicker
                        placeholder='请输入开启补光灯时间'
                        size = "small"
                        onChange={(val,str) =>{
                          this.setState({
                            time:  _.assign(this.state.time, {on: str})
                          })
                        }}
                      />
                      <TimePicker
                        placeholder='请输入关闭补光灯时间'
                        size = "small"
                        onChange={(val,str) =>{
                          this.setState({
                            time:  _.assign(this.state.time, {off: str})
                          })
                        }}
                      />
                    </div>
                    </IceContainer>
                  </TabPane>
                </Tab>
                <div style={{ marginTop: 20 }}>
                  <ButtonGroup>
                    <Button type="primary" onClick={ this.save }>保存</Button>
                  </ButtonGroup>
                </div>
              </Col>
            </Row>

          </IceContainer>

        </div>
      )
  }
}

const styles = {
  panel: {
    'minWidth': '600px',
  },
  range: {
    marginBottom: "40px",
    marginTop: "40px",
  }
}
