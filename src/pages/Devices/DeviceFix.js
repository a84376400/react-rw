import _ from 'lodash';
import React, {
  Component
} from 'react';
import {
  hashHistory,
  Link
} from 'react-router';
import {
  Input,
  Card,
  Button,
  Feedback,
  Switch,
  Step,
  Grid,
  Icon
} from "@icedesign/base";
import IceContainer from '@icedesign/container';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import IceTitle from '@icedesign/title';
import fpmc, {
  Func,
  Query
} from 'fpmc-jssdk';

import UserService from '../../user.js';

const ButtonGroup = Button.Group;
const Toast = Feedback.toast;


const { Row, Col } = Grid;

class DeviceFix extends Component{

  constructor(props) {
    super(props);
    const { sn = 'fffefdfc' } = props.params
    this.sn = sn

    this.state = {
      currentStep: 0,
      restarting: false,
      device: {},
      info: { sensor: {}, switcher: {}}
    }
    this.steps = [
      {
        title: '设备自检' ,
        data: [
          {
            condition: '市电',
            validate: true,
            operation: '225v',
            description:
              '市电异常可能是：1. 电缆被损坏；2. 设备火线腐蚀',
          },
          {
            condition: '光端机',
            validate: true,
            operation: (<Button type="secondary" loading={ this.state.restarting } onClick={ this.restartGuangduanji }>重启光端机</Button>),
            description:
              '光端机异常可能是：1. 设备老化',
          },
          // {
          //   condition: '温湿度',
          //   validate: false,
          //   // url: require('./images/1.png'),
          //   operation: '温度: 42',
          //   description:
          //     '设备过热/过冷，会导致无法正常运作，检查加热和散热设备',
          // },
          // {
          //   condition: 'NB延迟',
          //   validate: false,
          //   // url: require('./images/1.png'),
          //   operation: '解决方式链接',
          //   description:
          //     '说明以及解决方案说明以及解决方案说明以及解决方案说明以及解决方案说明以及解决方案',
          // },
        ]

      }, {
        title: '远程重启',
        data: [
          {
            condition: '尝试重启',
            validate: true,
            operation: (<Button type="secondary" loading={ this.state.restarting } onClick={ this.restart }>重启</Button>),
            description:
              '重启需要3-5分钟，设备会重新自检，解决部分问题，请耐心等待',
          },
        ]
      }, {
        title: '创建工单',
        data: [
          {
            condition: '派单',
            validate: true,
            // url: require('./images/1.png'),
            operation: (<Button type="secondary" loading={ this.state.restarting } onClick={ this.restart }>派单</Button>),
            description:
              '系统会创建工单并通知运维人员，请耐心等待',
          }
        ]
      }, {
        title: '修复完成',
        data: [
          {
            condition: '检修完成',
            validate: true,
            // operation: ,
            description:
            (<Button type="secondary" loading={ this.state.restarting } onClick={ this.doneFix }>检修完成</Button>),
          }
        ]
      }
    ]

  }
    componentWillMount(){

      this.setState({
        device: {}
    })
  }

    componentDidMount(){
      // fetch the device last info
       // get the device basic info
      new Query('dvc_device').condition(`sn = '${this.sn}'`).first().then( data => {
        this.setState({device: data.get()})
      })

      // Get the registers
      // get latest info of the device
      // the function contains the latest info
      new Func('device.getRegisters').invoke({ sn: this.sn})
        .then((data) => {
          // set data
          const info = { sensor: {}, switcher: {}}
          _.map(data, register => {
            const { addr, rw, name } = register
            if(name == '保留'){
                return
            }
            if(rw == 3){
                // switcher
                info.switcher['r' + addr] = register
            }else if(rw == 2){
                // sensor
                info.sensor['r' + addr] = register
            }
          })
          this.setState(info)
        })
        .catch(console.error)
    }



    restart = () =>{
      this.setState({ restarting: true })
      new Func('device.send').invoke({ sn: this.sn, op: 'REBOOT', uid: UserService.me().getId()})
        .then(() => {
          Toast.success('设备重启中, 可能需要3-5分钟，请耐心等候.');
        })
        .catch(console.error)
    }

    doneFix = async () =>{
      this.setState({ restarting: true })
      new Func('device.send').invoke({ sn: this.sn, op: 'RESET_MODE', uid: UserService.me().getId()})
        .then(() => {
          Toast.success('设备已回复正常的运行状态.');
          new Func('device.updateDevice').invoke({ sn: this.sn, fixing: 0,op: 'fixed'})
          this.setState({ restarting: false })
        })
        .catch(console.error)
    }

    restartGuangduanji = () =>{
      this.setState({ restartGuangduanji: true })
      new Func('device.send').invoke({ sn: this.sn, unit: "0006", op : "SET", val: 2, uid: UserService.me().getId()})
        .then(() => {
          Toast.success('光端机重启中, 可能需要3-5分钟，请耐心等候.')
        })
        .catch(console.error)
    }

    itemRender = (index, status) => {
      return index + 1;
    }

    next = () => {
      let { currentStep } = this.state
      currentStep++
      this.setState({ currentStep })
    }
    prev = () => {
      let { currentStep } = this.state
      currentStep--
      this.setState({ currentStep })
    }

    render() {
      const breadcrumb = [
        { text: '设备管理', link: '' },
        { text: '控制列表', link: '#/devices/list' },
        { text: this.state.device.name, link: `#/devices/panel/${ this.sn }` },
        { text: '远程修复', link: '' },
      ];

        return (
          <div className="cate-list-page">
              <CustomBreadcrumb dataSource={breadcrumb} />
              <IceContainer>
                <Link to={`/devices/panel/${ this.sn }`}><IceTitle text={ this.state.device.name }></IceTitle></Link>
                  <div className="fusion-demo-item">
                      <Step current={ this.state.currentStep} animation={false}>
                          { this.steps.map( (item, index) => (
                          <Step.Item key={index} title={item.title} itemRender={this.itemRender} />
                          ))}
                      </Step>
                  </div>

                  <div>
                  {this.steps[this.state.currentStep].data.map((item, index) => {
                    return (
                      <div style={styles.row} key={index}>
                        <Row wrap>
                          <Col xxs="24" s="4">
                            <div style={styles.imageWrap}>
                              <span>{item.condition}</span>
                            </div>
                          </Col>
                          <Col
                            xxs="24"
                            s="16"
                            style={{
                              ...styles.itemBody,
                            }}
                          >
                            <span
                              style={
                                item.validate
                                  ? styles.itemStatusSuccess
                                  : styles.itemStatusFail
                              }
                            >
                              <Icon type={ 'warning' } style={{ color: "#FFA003" }}/>
                            </span>
                            <div
                              style={{
                                ...styles.itemDescription,
                              }}
                            >
                              {item.description}
                            </div>
                          </Col>
                          <Col xxs="24" s="4">
                            <div style={styles.operationWrap}>
                                {item.operation}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
                <div style={{ textAlign: 'center', margin: '20px'}}>
                  <ButtonGroup>
                      <Button
                          onClick={this.prev}
                          type="primary"
                          disabled={ this.state.currentStep === 0}
                      >
                          上一步
                      </Button>
                      <Button
                          onClick={this.next}
                          type="primary"
                          disabled={ this.state.currentStep === 3}
                      >
                          下一步
                      </Button>
                  </ButtonGroup>
                </div>
              </IceContainer>

          </div>
        );
    }
}
const styles = {
    row: {
      backgroundColor: '#f9f9f9',
      marginTop: '32px',
      padding: '20px 40px',
    },
    imageWrap: {
      textAlign: 'center',
    },
    image: {
      width: '64px',
      height: '64px',
      borderRadius: '50',
      marginBottom: '12px',
    },
    itemBody: {
      padding: '10px 50px 0',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
    },
    itemDescription: {
      color: '#666',
      marginTop: '20px',
      // maxWidth: '309px',
    },
    operationWrap: {
      marginTop: '40px',
      textAlign: 'center',
    },
    itemFooter: {
      textAlign: 'center',
      color: '#666',
      marginTop: '40px',
    },
    nextBtn: {
      marginTop: '40px',
    },
    itemStatusSuccess: {
      color: '#1be25c',
    },
    itemStatusFail: {
      color: '#f33',
      fontSize: '16px',
    },
    itemStatusText: {
      marginLeft: '10px',
    },
    mobileContentCenter: {
      textAlign: 'center',
      padding: '20px 0 0 0',
    },
    removeContentWidth: {
      maxWidth: 'none',
    },
  };
export default DeviceFix
