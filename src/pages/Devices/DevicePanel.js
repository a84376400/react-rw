import React, {
  Component
} from 'react';
import {
  Link,
  hashHistory
} from 'react-router';
import {
  Grid,
  Switch,
  Tab,
  Button,
  moment,
  Dialog,
  Feedback,
} from '@icedesign/base';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import CustomTable from '../../components/CustomTable';
import RebootTable from '../../components/RebootTable';
import Img from '@icedesign/img';
import {
  OperateRecord,
  BugNews
} from './components/LatestNews';

import _ from 'lodash'
import PubSub from 'pubsub-js';
import fpmc, {
  Query,
  Func
} from 'fpmc-jssdk';
import UserService from '../../user.js';

import CameraAddButton from './components/VideoCamera/CameraAddDialog';
import CameraPreview from './components/VideoCamera/CameraPreview';
import { add } from 'gl-matrix/src/gl-matrix/mat3';


const {
  Row,
  Col
} = Grid;
const TabPane = Tab.TabPane;
const Toast = Feedback.toast;

moment.locale('zh-cn')
export default class DevicePanel extends Component{

  constructor(props) {
    super(props);
    const {
      sn = 'fffefdfc'
    } = props.params
    this.sn = sn
    this.state = {
      device: {},
      troubles: [],
      alarms: [],
      camera: [],
      switcher: {},
      sensor: {},
      deviceState: {},//设备部件状态
      updateAt: '', // 更新时间
      disabled: false,
      time: 0,
    }
    this.deviceStateColums = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
    },{
      title: 'Value',
      dataIndex: 'val',
      key: 'val',
      align: 'center',
      width: 100,
      render: (value,index, record) => {
        switch(record.type){
          case 'Boolean':
            return <IceLabel status={ record.val == 1 ? 'success': 'danger' } > {
              record.val == 0 ? '关闭' : '开启'
            } </IceLabel>
          case 'Onoff':
            return <IceLabel status={ record.val == 1 ? 'success': 'danger' } > {
              record.val == 0 ? '异常' : '正常'
            } </IceLabel>
        }
      }
    },
  ]

  this.deviceCameraColumns = [
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
      render: (value, index, record) => {
        if(record){
          return <CameraPreview
                   key={record.id}
                   id={record.id}
                   index={ index }
                   sn={this.sn}
                   info={record}
                   record={record}
                   editOk= { this.handleCameraEditOk }
                   getCamera={ this.getCamera }

                 />
        }
      }
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip',
      align: 'center',
      width: 135,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 65,
      render: (value, index, record) => {
        if(record){
          return <IceLabel status={ record.status == 'OFFLINE' ? 'danger': 'success' } > {
            record.status == 'OFFLINE' ? '离线' : '在线'
          } </IceLabel>
        }
      }
    }
    ]

    this.sensorColumns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        align: 'center',
      },
      {
        title: 'Value',
        dataIndex: 'val',
        key: 'val',
        align: 'center',
        width: 100,
        render: (value, index, record) => {
          switch (record.type) {
            case 'Boolean':
              return <span > {
                record.val == 0 ? '关闭' : '开启'
              } </span>
            case 'Onoff':
              return <span > {
                record.val == 0 ? '异常' : '正常'
              } </span>
            case 'Int16':
              return <span > {
                record.val / 10.0
              } </span>
            case 'UInt16':
              return <span > {
                record.val
              } </span>
          }
        }
      },
    ];
    this.switcherColumns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        align: 'center',
      },
      {
        title: 'Value',
        dataIndex: 'val',
        key: 'val',
        align: 'center',
        width: 100,
        render: (value, index, record) => {
          return ( <Switch checked = {
              record.val === 1
            }
            onChange = {
              /*send message to controll device*/
              (checked) => this.onSwitcherChange(record, checked)
            }
            disabled={this.state.disabled}
            checkedChildren = "开"
            unCheckedChildren = "关" />
          )
        }
      },
    ]


  }

	getCamera = () => {
	  new Query('dvc_camera')
	    .condition({
	      device_sn: this.sn,
      })
      .sort('id+')
	    .find()
	    .then(data => {
	      this.setState({
	        camera: data
	      });
	    })
	    .catch(console.error);
	}

  onSwitcherChange = (record, checked) => {

    record.val = checked ? 1 : 0
    let data = {}
    data['r' + record.addr] = record
    const switcher = _.assign(this.state.switcher, data)
    this.setState({
      switcher
    })
    // send the command
    new Func('device.send')
      .invoke({
        sn: this.sn,
        unit: record.addr,
        op: 'SET',
        val: record.val,
        uid: UserService.me().getId()
      })
      .then(data => {
        // append the command to history
        const {
          commands
        } = this.state
        commands.unshift({
          nickname: UserService.me().get('nickname'),
          val: record.val,
          unit: record.addr
        })
        this.setState({
          commands
        })
      })
      .catch(console.error)
  }

  restartCamera = () =>{
    
    _.map(this.state.switcher, register => {
      const {
        addr,
        rw,
        name,
        id
      } = register
      if(id==2){
        register.val = (register.val === 0)? 1: 0
        // send the command
        new Func('device.send')
          .invoke({
            sn: this.sn,
            unit: register.addr,
            op: 'SET',
            val: register.val,
            uid: UserService.me().getId()
          })
          .then(data => {
            // append the command to history
            const {
              commands
            } = this.state
            commands.unshift({
              nickname: UserService.me().get('nickname'),
              val: register.val,
              unit: register.addr
            })
            this.setState({
              commands
            })
          })
          .catch(console.error)
      }
    }
    )
  }
  componentDidMount() {
    new Query('dvc_device')
      .condition(`sn = '${this.sn}'`)
      .first()
      .then(data => {
        this.setState({
          device: data.get()
        })
    })
    this.getCamera();
    // Get the registers
    // get latest info of the device
    // the function contains the latest info
    new Func('device.getRegisters').invoke({
        sn: this.sn
      })
      .then((data) => {
        // set data
        const info = {
          sensor: {},
          switcher: {},
          deviceState: {}
        }
        _.map(data, register => {
          const {
            addr,
            rw,
            name,
            id
          } = register
          if (name == '保留') {
            return
          }
          if (rw == 3) {
            // switcher
            info.switcher['r' + addr] = register
            //同时记录设备的部件状态
            if(id === 5 || id === 4 || id === 3 ){
              info.deviceState['r' + addr] = register
            }
          } else if (rw == 2) {
            // sensor //id in(13,15,10,17,12)
            if(id ===13 || id === 10 || id === 15 || id ===17 || id === 12){
              info.sensor['r' + addr] = register
            }
            else if(id === 11){
              info.deviceState['r' + addr] = register
            }
          }
        })
        this.setState(info, () => {
          //Subscrib the device event
          PubSub.subscribe('message', (topic, msg) => {
            if(this.sn !== ((msg.sn)||(msg.id))) return; // ignore the others' device message;
            console.log('receive', msg)
            if (msg.fn == 'OFFLINE') {
              this.setState({
                device: Object.assign(this.state.device, {
                  status: 'OFFLINE'
                })
              })
              return;
            }
            if( msg.fn == 'ALARM'){
              // alert('error');
              return;
            }
            if (msg.fn == 'ONLINE'){
              this.setState({
                device: Object.assign(this.state.device, {
                  status: 'ONLINE'
                })
              })
              return;
            }
            this.renderInfo(msg)
          })
        })
      })
      .catch(console.error)

    new Query('evt_event')
      .condition(`sn = '${this.sn}' and network = 'TCP'`)
      .sort('createAt-')
      .first()
      .then(data => {
        if(data.data){
          const { createAt } = data.data;
          this.setState({ updateAt: moment(createAt).startOf('hour').fromNow() });
        }
      })
    // get command history
    new Func('device.getCommands').invoke({
        sn: this.sn
      })
      .then((data) => {
        data = data.data
        this.setState({
          commands: data.rows
        })
      })
      .catch(console.error)

    // get the trouble list
    new Query('opt_trouble').condition(`sn = '${this.sn}'`).findAndCount().then(data => {
      this.setState({
        troubles: data.rows
      })
    })

    new Query('dvc_alarm').condition(`sn = '${this.sn}'`).page(1, 20).findAndCount().then(data => {
      this.setState({
        alarms: data.rows
      })
    })
  }

  renderInfo = (msg) => {
    if (msg.sn != this.sn) {
      return;
      // ignore the other device info.
    }
    this.setState({
      updateAt: moment(_.now()).startOf('hour').fromNow()
    })
    if( msg.fn != 'PUSH' && msg.fn != 'SET' && msg.fn != 'GET'){
      return;
    }

    let {
      sensor,
      switcher
    } = this.state;
    _.map(sensor, s => {
      const newValue = msg.registers[s.addr]
      _.extend(s, newValue)
    })
    _.map(switcher, s => {
      const newValue = msg.registers[s.addr]
      _.extend(s, newValue)
    })
    this.setState({
      sensor,
      switcher
    })
  }

  componentWillUnmount() {
    PubSub.unsubscribe('message')
  }

  handleCameraCreateOk = ( cameraInfo ) => {

    const { camera } = this.state;
    camera.push(cameraInfo);
    this.setState({
      camera
    });
  }

  handleFixMode = () => {
    /*在点击维修按钮之后将device fixing: 1 更新进数据库*/
   new Func('device.updateDevice')
    .invoke({
      sn: this.sn,
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
              sn: this.sn,
              op: 'FIX_MODE',
              uid: UserService.me().getId()
            })
          hashHistory.push(`/devices/fix/${this.sn}`)
        } catch (error) {
          Toast.error(error.message || 'System Error!')
        }
      }
    });
  }

	handleCameraEditOk = ( cameraInfo, index ) => {
    const { camera } = this.state;
    camera[index] = cameraInfo;
    this.setState({
      camera
    });
  }

  render(){
    let timeChange;
    let ti = 10;
    //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
    const clock =()=>{
      if (ti > 0) {
        //当ti>0时执行更新方法
        ti = ti - 1;
        this.setState({
          time: ti
        })
        console.log(ti)
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
      //判断当前state.network的状态 如果时tcp return 如果是nb就执行一下的逻辑
      if(this.state.device.status == 'ONLINE' || this.state.time > 0) return
      this.setState({
        disabled: true,
      });
      //每隔一秒执行一次clock方法
      timeChange = setInterval(clock,1000);
    }

    const breadcrumb = [
        { text: '设备管理', link: '' },
        { text: '控制列表', link: '#/devices/list' },
        { text: '控制面板', link: '' },
      ];
    return (
      <div className="dashboard-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <IceContainer style={styles.panel}>
          <h2>{ this.state.device.name }
            <IceLabel
              status={ this.state.device.status == 'ONLINE'? 'success': 'danger' } >{ this.state.device.status == 'ONLINE'? '在线': '异常'}
            </IceLabel>
            <IceLabel
              status={ 'success' } >{ this.state.device.status != 'ONLINE' ? 'NB': ''}
            </IceLabel>
            <IceLabel
              status={ this.state.device.fixing ==  1 ? 'warning': 'default ' } >{ this.state.device.fixing == 1 ? '维修中': undefined}
            </IceLabel>
            <Button type="normal" shape="warning" style={ { float: 'right'}} onClick={ this.handleFixMode } >维修</Button>
          </h2>
          <p>更新于: { this.state.updateAt }</p>
          <Row wrap >
            <Col xxs="24" l="5">
                <div>
                  <h4>传感器</h4>
                  <CustomTable maxBodyHeight={310} dataSource={ _.values(this.state.sensor) } hasHeader={false} columns={ this.sensorColumns} />
                </div>
                <div style={styles.div}>
                  <h4>设备状态</h4>
                  <CustomTable maxBodyHeight={310} dataSource={ _.values(this.state.deviceState) } hasHeader={false} columns={this.deviceStateColums}></CustomTable>
                </div>
            </Col>
            <Col xxs="24" l="7">
              <Img
                src={require('../../images/camera1.png')}
                style = { styles.cameraImg}
                width = 'auto'
                height = '600px'
              >
              </Img>
            </Col>
            <Col xxs="24" l="6">
              <div style={ {position: "relative"} }>
                <div style={{overflow: 'hidden' }}>
                  <CameraAddButton
                    sn={this.sn}
                    createOk={ this.handleCameraCreateOk }
                  />
                  {/* <div style={ {display: 'block', float: 'left'} }><h4>摄像头</h4></div> */}
                </div>
                <div>
                  <CustomTable maxBodyHeight={180} dataSource={ _.values(this.state.camera)} hasHeader={true} columns={this.deviceCameraColumns} />
                </div>
                <div style={ {position: "absolute", top: 294} }>
                  <h4>控制开关</h4>
                  <CustomTable maxBodyHeight={310} dataSource={ _.values(this.state.switcher)} hasHeader={false} columns={ this.switcherColumns} onClick={sendCode} />
                </div>
              </div>
            </Col>
            <Col xxs='24' l='2'></Col>
            <Col xxs="24" l="4">
              <Tab>
                <TabPane tab="告警记录" key="1">
                  <BugNews data = { this.state.alarms } state='process'/>
                </TabPane>
                <TabPane tab="故障记录" key="2">
                  <BugNews data = { this.state.troubles }/>
                </TabPane>
                <TabPane tab="操作记录" key="4">
                  <OperateRecord commands = { this.state.commands } switcher = { this.state.switcher } />
                </TabPane>
              </Tab>
              <div>
                <h4>快速检修</h4>
                <RebootTable sn={this.sn} restartCamera = {this.restartCamera} removeFixState = {()=>
                { 
                  this.setState({
                    device: Object.assign(this.state.device, {
                      fixing: 0
                    })
                  })
                 }} setFixState = {()=>
                  { 
                   this.setState({
                    device: Object.assign(this.state.device, {
                    fixing: 1
                  })
                }) }} >
                </RebootTable>
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
    'minHeight': '500px',
    // 'background': '#6699CC',
  },
  div: {
    paddingTop: '30px'
  },
  
  primaryButton: {
    height: 50,
    fontSize: 16,
    padding: '0 20px',
    lineHeight: '50px',
    color: '#fff',
    marginTop:'80px'
  },
  buttonBox:{
    width:'100%',
    height:'100%',
    textAlign:'center',
	},
	dialog:{
		width : 700,
	},
	addRow:{
		lineHeight:'40px'
	},
	addTitle:{
		textAlign:'right'
	},
	addInput:{
		lineHeight:'100%',
		height:'25px',
		width:'95%'
	},
	addInputMonth:{
		lineHeight:'100%',
		height:'25px',
		width:'80%'
	},
	addSelect:{
		marginTop: 5,
		width: '95%',
  		height: '27px'
	},
	datePicker:{
		width:'95%',
	},
	cameraCol:{
		padding:'5px',
	},
	cameraBox:{
		textAlign:'center',
		// border:'1px solid #000',
		background:'#fafafa',
		minHeight:'200px',
		padding:'15px'
	},
	cameraBtnBox:{
		textAlign:'right'
	},
	cameraBtn:{
		background:'#2ECA9C'
	},
	cameraImg:{
		// width:'100px',
		// marginTop:'20px',
    // cursor:'pointer'
    marginTop: '23px'
	},
	cameraTextBox:{
		display:'flex',
		flexDirection:'row',
		justifyContent: 'space-between',
		paddingTop:'20px'
	}
}
