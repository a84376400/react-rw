import React, { Component } from 'react';
import IceTitle from '@icedesign/title';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';
import IceContainer from '@icedesign/container';
import { Grid, Calendar, Button, Icon, Feedback } from "@icedesign/base";
import fpmc, { Func } from 'fpmc-jssdk';
import UserService from '../../../user.js';
import _ from 'lodash';
const {
  Row,
  Col
} = Grid;
const { Toast } = Feedback;

const style = {
  position: "absolute",
  width: "calc(100% - 8px)",
  height: "2px",
  textAlign: "center",
  background: "#ddd",
  top: 0,
  left: 4
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.uid = UserService.me().getId();
    this.state = {
      record: {},
    };
  }

  fetchData = (date) => {
    const param = { uid: this.uid, year: date.getFullYear(), month: date.getMonth() + 1 };
    new Func('staff.getSigninRecord')
      .invoke(param)
      .then( data => {
        console.log(data)
        this.setState({ record: data })
      })
      .catch(error => {
        console.log(error)
        this.setState({ record: {} })
      });
  }
  componentWillMount(){
    // get company by staff_id
    const NOW = new Date();
    this.fetchData(NOW);
  }

  onDateChange = (next) => {
    const { mode, base } = next;
    if(mode == 'year'){
      return;
    }
    if(mode == 'date'){
      return;
    }
    this.fetchData(base._d);
    
  }

  handleSignin = () => {
    new Func('staff.signin')
      .invoke({ uid: this.uid })
      .then( data => {
        this.setState({ record: _.assign(this.state.record, data) })
      })
      .catch(error => {
        Toast.error('签到失败!')
      });
  }

  dateCellRender = ( calendarDate ) => {
    const { record } = this.state;
    let flag = false;
    if(!_.isEmpty(record)){
      flag = record['d' + calendarDate.date] == 1;
    }
    return (<div>
      <span style={style} />
    { flag? <Icon type="success" type="pin" style={{ color: "#1DC11D", marginRight: "10px" }}/>: '' }
      {calendarDate.date}
    </div>
    )
  }

  render() {
    const breadcrumb = [
      { text: '运维管理', link: '' },
      { text: '考勤签到', link: '#/operation/signin' },
    ];
    
    return (
      <div className="basic-setting-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <IceContainer>
          <Row wrap>
            <Col xxs="24" l="16">
              <IceTitle> 日历 </IceTitle>
              <div className="custom-calendar-guide">
                <Calendar 
                  mode={'month'}
                  onChange = { this.onDateChange }
                  dateCellRender={ this.dateCellRender } />
              </div>
            </Col>
            <Col xxs="24" l="1"></Col>
            <Col xxs="24" l="7">
              <IceTitle> 签到 </IceTitle>
              <Button type="secondary" size="large" onClick={ this.handleSignin }>点击打卡</Button>
            </Col>
          </Row>
          
        </IceContainer>
        
      </div>
    )
  }
}