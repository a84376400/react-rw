import React, { Component } from 'react';
import { moment, Button, Balloon, Badge, Tab, Timeline, Notice } from '@icedesign/base';
import { Query } from 'fpmc-jssdk';
import { Link } from 'react-router';
import FoundationSymbol from 'foundation-symbol';
import _ from 'lodash';
import PubSub from 'pubsub-js';
import IceNotification from '@icedesign/notification';
import fpmc from "fpmc-jssdk";

const TabPane = Tab.TabPane;
const { Item: TimelineItem } = Timeline;

export default class Alarm extends Component{

  constructor(props){
    super(props);
    this.state = {
      badgeCount: 0,
      troubleList: {},
      alarmList: [],
      balloonVisible: false, //气泡
      disableContent:{}
    };
  }

  onTabChange = async (key) => {
    if(key === 'trouble'){
      this.getTrouble()
    }else{
      this.getAlarm()
    }
  }

  getTrouble = async ()=>{
    try {
      new fpmc.Func('trouble.getLatestTroubleInfo')
        .invoke()
        .then( data => {
          this.setState({
            troubleList: _.keyBy(data.arr , 'id'),
            badgeCount: data.len,
          });
        })
    } catch (error) {
      console.error(error)
    }
  }

  getAlarm = async ()=>{
    try {
      new fpmc.Func('device.getLastAlarmInfo')
        .invoke()
        .then( data => {
          this.setState({
            alarmList: _.keyBy(data, 'id')
          });
        })

     /* const Alarm_sn_list = []

      await new Query('dvc_alarm')
        .page(1, 5)
        .sort('id-')
        .findAndCount().then(data_alarm => {
           _.forEach(data_alarm.rows,(item,index)=> {
             Alarm_sn_list.push(item.sn)
          })
          new Query('dvc_device')
            .condition(`sn in ('${Alarm_sn_list[0]}','${Alarm_sn_list[1]}','${Alarm_sn_list[2]}','${Alarm_sn_list[3]}','${Alarm_sn_list[4]}')`)
            .findAndCount()
            .then(data_device => {
              const device_name_sn = _.map(data_device.rows, item => {
                return { sn: item.sn, name: item.name}
              })
              _.forEach(data_alarm.rows, (item_alarm,index)=> {
                _.forEach(device_name_sn, (item_device,index)=> {
                  if (item_device.sn == item_alarm.sn) {
                    //将item_alarm对象中添加name属性
                    item_alarm.name = item_device.name
                  }
                  this.setState({
                    alarmList: data_alarm.rows,
                  });
                })
              })
            })
        })*/


    } catch (error) {
      console.error(error)
    }
  }

  componentWillMount(){
    this.getTrouble()
    PubSub.subscribe('message', (topic, msg) => {
      if(msg.fn === 'PUSH') return;
      const { alarmList, troubleList, badgeCount } = this.state;
      switch(msg.fn){
        case 'ALARM':
          IceNotification.error({
            message: '设备报警',
            description:
              `编号[${msg.sn}]-${msg.name}: ${ msg.title }`,
          });
          alarmList.push({
            title: msg.title,
            sn: msg.sn,
            name: msg.name,
            createAt: _.now(),
          })
          this.setState({ alarmList })
          return;
        // case 'CAMERA_TROUBLE':
        //   IceNotification.error({
        //     message: '监控报警',
        //     duration: null,
        //     description:
        //       `IP为[${msg.ip}]的设备: 网络故障`,
        //   });
        //   return;
        case 'TROUBLE':

          troubleList[msg.trouble_id] = {
            id: msg.trouble_id,
            title: msg.title,
            sn: msg.sn,
            name: msg.name,
            createAt: _.now(),
          };
          this.setState({
            troubleList,
            badgeCount: badgeCount + 1,
          })

          IceNotification.error({
            message: '设备故障',
            description:
              `编号[${msg.sn}]的${msg.name}: ${ msg.title }`,
          });
          return;
        case 'TROUBLE_FIX':
          delete troubleList[msg.trouble_id];
          this.setState({
            troubleList,
            badgeCount: badgeCount - 1,
            name: msg.name,
          })
          return;

      }
    });
  }

  openBalloon = () => {
    this.setState({
      balloonVisible : true,
    });
  }

  closeBalloon = () => {
    this.setState({
      balloonVisible : false,
    });
  }

  componentWillUnmount(){
    PubSub.unsubscribe('message')
  }
  render(){

    return(
      <Balloon
        style={ styles.balloon }
        trigger={
          <div onClick={this.openBalloon}>
            <FoundationSymbol type={this.props.icon} size="small" />
            <Badge count={ this.state.badgeCount || 0 } overflowCount={10}>
              {this.props.text}
            </Badge>
          </div>
        }
        closable = {false}
        triggerType= "click"
        align="b"
        alignment="edge"
        >

        <Tab
          onChange={ this.onTabChange }
          contentStyle={{ padding: 3 }}
          size="small">
          <TabPane tab="故障" key="trouble" style={ styles.tabContent } >
            {
              _.isEmpty(this.state.troubleList)? (
                <div style={ styles.noMessage } >暂无故障信息！</div>
              ): (
                <div>
                  <Timeline>
                    {
                      _.map(this.state.troubleList, (trouble, idx) => {
                        return (
                          <TimelineItem
                            key={`trouble_${idx}`}
                            title={trouble.title}
                            content={
                              <div>{`设备：【${trouble.name}】发生 【 ${trouble.title} 】 故障`}</div>
                            }
                            time={ moment(trouble.createAt).format('MM-DD HH:mm:ss') }
                            state="error"
                          />
                        )
                      })
                    }

                  </Timeline>
                  <Button shape="text" size="small"><Link to="/trouble/list">查看全部</Link></Button>
                </div>

              )
            }


          </TabPane>
          <TabPane tab={ <Badge dot={ _.size(this.state.alarmList)>0 } ><span>警报</span></Badge>} key="alarm" style={ styles.tabContent } >
            {
              _.isEmpty(this.state.alarmList)? (
                <div style={ styles.noMessage } >暂无告警信息！</div>
              ): (
                <div>
                  <Timeline>
                    {
                      _.map(this.state.alarmList, (item, idx) => {

                        return (
                          <TimelineItem
                            key={`alarm_${idx}`}
                            title={item.title}
                            content={
                              <div>{`设备：【${item.name}】发生 【 ${item.title} 】 警告`}</div>
                            }
                            time={ moment(item.createAt).format('MM-DD HH:mm:ss') }
                            state="process"
                          />
                        )
                      })
                    }
                  </Timeline>
                  <Button shape="text"><Link to="/trouble/alarm">查看全部</Link></Button>
                </div>)
            }
          </TabPane>
        </Tab>

      </Balloon>
    )
  }
}

const styles = {
  balloon: {
    width: 400,
    minWidth: 400,
    padding: 5,
    paddingTop: 20,
  },
  tabContent: {
    maxHeight: 500,
    overflow: 'auto'
  },
  noMessage: {
    color:'#666',
    height:'100px',
    textAlign:'center',
    paddingTop:'40px'
  }
}
