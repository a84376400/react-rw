import React, { Component } from 'react';
import { Calendar, Feedback, DatePicker } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import fpmc from 'fpmc-jssdk';
import _ from 'lodash';
import UserService from '../../../../user.js';
import WrappedDialogForm from './wrappedDialogForm';

const { RangePicker } = DatePicker;
const Toast = Feedback.toast;


//  注意，如果该员工未打卡，则说明人未报道， 不能派单
// 该类用于计算两个日期总天数， 默认起点为当年元月1日
class CalendarCom {
  today = () => {
    const dd = new Date();
    const year = dd.getFullYear();
    const month = dd.getMonth() + 1;
    const day = dd.getDate();
    const today = year.toString() +  '-' + month.toString() + '-' + day.toString();
    return today;
  }
  getDays = (dataArray) => {
    const DatesArr = dataArray || [ this.today(), this.basePoint() ];
    const strSeparator = "-";
    const Date1 = DatesArr[0].split(strSeparator);
    const Date2 = DatesArr[1].split(strSeparator);
    const strDateS = new Date(Date1[0], Date1[1] - 1, Date1[2]);
    const strDateD = new Date(Date2[0], Date2[1] - 1, Date2[2]);
    const iDays = parseInt(Math.abs(strDateS - strDateD)/1000/60/60/24); 
    // 总天数为日期差+1
    return iDays + 1;
  }
  // 其值为当前年元月第一天
  basePoint = () => {
    const dd = new Date();
    const year = dd.getFullYear();
    const base = year.toString() + '-' + '1' + '-' + '1';
    return base;
  }
}
const _calendarCom = new CalendarCom();

export default class CaleBasePage extends Component {
  static displayName = 'CalendarTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      totalDays: '',
      attendances: '',
      dispathDays: '',
      data: {
        '2018-6-18': {
          memo: '',
          dispath: 'null',
        },
        '2018-6-19': {
          memo: '',
          dispath: 'null',
        },
      },
    };
  }

  /*
  数据加载要在“组件”已经挂载到真实页面之后,且只执行一次
  */
  componentDidMount() {
    this.fetchData();
    this.attendanceDefaultDays();
  }

  attendanceDays = () => {
    const q = new fpmc.Query('rw_checkin');
    const dd = new Date();
    const uid = UserService.me().get().username;
    const DaysSQL = `
      uid='${uid}'
      and year='${dd.getFullYear()}' 
      `;
    return q.condition(DaysSQL).find();
  }

  dispathFullDays = () => {
    const q = new fpmc.Query('rw_checkin');
    const dd = new Date();
    const uid = UserService.me().get().username;
    const dispathSQL = `
    uid='${uid}'
    and year='${dd.getFullYear()}'
    and dispath is not NULL
    and dispath !='null'
    `;
    return q.condition(dispathSQL).find();
  }

  // 获取默认打卡数和派单数并 setState()
  attendanceDefaultDays = async () => {
    const attendance = await this.attendanceDays();
    const disDays = await this.dispathFullDays();
    const dispathDays = disDays.length;
    this.setState({
      totalDays: _calendarCom.getDays(),
      attendances: attendance.length,
      dispathDays,
    });
  };

  fetchData = (nextState) => {
    if (!nextState) {
      const q = new fpmc.Query('rw_checkin');
      // 使用系统登录username 作为数据库考勤条件
      const uid = UserService.me().get().username;
      const dd = new Date();
      q.condition(`uid='${uid}'
      and month in (${dd.getMonth() - 1}, ${dd.getMonth()}, ${dd.getMonth() + 1})`)
        .sort('month+').find().then((rows) => {
          const data = {};
          rows.forEach((row) => {
            const dataKey = `${row.year}`+'-'+`${row.month}`+'-'+ `${row.day}`;
            const memo = `${row.memo}`;
            const dispath = `${row.dispath}`;
            data[dataKey] = {
              memo,
              dispath,
            };
          });
          this.setState({
            data,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (nextState.base._d.getMonth() === new Date().getMonth()) {
      return false;
    } else {
      const q = new fpmc.Query('rw_checkin');
      const uid = UserService.me().get().username;
      const dd = nextState.base._d;
      q.condition(`uid='${uid}'
      and month in (${dd.getMonth()}, ${dd.getMonth() + 1}, ${dd.getMonth() + 2})`)
        .sort('month+').find().then((rows) => {
          const data = {};
          rows.forEach((row) => {
            const dataKey = `${row.year}`+'-'+`${row.month}`+'-'+ `${row.day}`;
            const memo = `${row.memo}`;
            const dispath = `${row.dispath}`;
            data[dataKey] = {
              memo,
              dispath,
            };
          });
          this.setState({
            data,
          });
        })
        .catch(console.error);
    }
  }

  sendState = (nextState) => {
    this.refs['dialog'].onOpen(nextState);
  }

  // 获取wrappedDialogForm 中date值，setState，完成页面重新渲染
  fetchDatafromForm = (value) => {
    const { data } = this.state;
    const index = value.year.toString() + '-' + value.month.toString() + '-' + value.day.toString();
    data[index] = { memo: value.meno, dispath: 'null' };
    this.setState({
      data,
    });
    this.attendanceDefaultDays();
  }

  checkExisted = (nextState) => {
    const q = new fpmc.Query('rw_checkin');
    const uid = UserService.me().get().username;
    const SQL = `
      uid='${uid}'
      and year='${nextState.value._d.getFullYear()}' 
      and month='${nextState.value._d.getMonth() + 1}'
      and day='${nextState.value._d.getDate()}'
      `;
    return q.condition(SQL).find();
  };

  // 返回一个Promise
  insertDate = () => {
    const obj = new fpmc.Object('rw_checkin');
    const dd = new Date();
    obj.set({
      uid: UserService.me().get().username,
      year: dd.getFullYear(),
      month: dd.getMonth() + 1,
      day: dd.getDate(),
      dispath: 'null',
    });
    return obj.create();
  }

  /*
   检查是否打卡，如遇到选择月份时获取数据给页面渲染
   如果未打卡， 询问是否要补打，如同意则要插入数据
   在 onChange 发生的时候调用 checkIn, 并且fetchData
  */
  checkIn = async (nextState) => {
    this.fetchData(nextState);
    if (!nextState.value) {
      return;
    }
    // 使用 _.cloneDeep 则表示创建了一个新的对象,深拷贝
    const data = _.cloneDeep(this.state.data);

    try {
      const result = await this.checkExisted(nextState);
      // console.info('打卡记录', result.length);
      if (result.length === 0) {
        if (new Date().getFullYear() === nextState.value._d.getFullYear()
              && new Date().getMonth() === nextState.value._d.getMonth()
                && new Date().getDate() === nextState.value._d.getDate()) {
          const insertResult = await this.insertDate();
          const { year, month, day } = insertResult._d;
          data[`${year}-${month}-${day}`] = insertResult._d;
          // 在打卡后重新获取总打卡数
          this.attendanceDefaultDays();
          Toast.success('打卡成功');
        } else if (new Date(new Date().setHours(0, 0, 0, 0)).getTime() > nextState.value._d.getTime()) {
          this.sendState(nextState);
        } else if (new Date().getTime() < nextState.value._d.getTime()) {
          Toast.error('你不能给未来打卡');
          return;
        }
      } else if (result.length === 1) {
        Toast.success('已经打过卡了');
      }
      this.setState({ data });
    } catch (err) {
      console.info(err);
    }
  }

  dataCellRender = (calendarDate) => {
    const { year, month, date } = calendarDate;
    const dateKey = `${year}-${month + 1}-${date}`;
    const dd = this.state.data[dateKey];
    // 圆点样式
    const dotStyle = {
      position: 'absolute',
      width: '10px',
      height: '10px',
      textAlign: 'center',
      background: '#f20850',
      top: '50%',
      left: '50%',
      borderRadius: '50%',
    };

    /* eslint-disable */
    return (
      (typeof dd === 'undefined') ? (
        <div>{calendarDate.date}</div>
      ) : (
        (typeof dd !== 'undefined' && dd.dispath !== 'null' && dd.day !=='') ? (
          <div style={{ background: '#55CA52', position: 'absolute', height: '80%', width: '90%' }}>
            <span style={dotStyle} />
            {calendarDate.date}
          </div>
        ) : (
          <div style={{ background: '#55CA52', position: 'absolute', height: '80%', width: '90%' }}>
            {calendarDate.date}
          </div>
        )
      )
    );
  }

  /* eslint-enable */
  rangeFetchDispath = (str) => {
    const q = new fpmc.Query('rw_checkin');
    const uid = UserService.me().get().username;
    const rangeFetchSQL = `
      uid='${uid}'
      and (
        STR_TO_DATE(CONCAT(year, '-', month, '-', day), '%Y-%m-%d')
        BETWEEN STR_TO_DATE('${str[0]}', '%Y-%m-%d') and STR_TO_DATE('${str[1]}', '%Y-%m-%d')
      ) and dispath is not NULL and dispath !='null'
    `;
    return q.condition(rangeFetchSQL).find();
  }

  rangeFetchAttendance = (str) => {
    const q = new fpmc.Query('rw_checkin');
    const uid = UserService.me().get().username;
    const rangeFetchSQL = `
    uid='${uid}'
    and (
      STR_TO_DATE(CONCAT(year,'-', month, '-', day),'%Y-%m-%d') 
      BETWEEN STR_TO_DATE('${str[0]}','%Y-%m-%d') and STR_TO_DATE('${str[1]}','%Y-%m-%d')
    ) 
    `;
    return q.condition(rangeFetchSQL).find();
  }

  RangePickerFunc = async (val, str) => {
    if (str[0] !== '') {
      const dis = await this.rangeFetchDispath(str);
      const dispathDays = dis.length;
      const attends = await this.rangeFetchAttendance(str);
      const attendances = attends.length;
      this.setState({
        totalDays: _calendarCom.getDays(str),
        dispathDays,
        attendances,
      });
    } else if (str[0] === '') {
      this.setState({
        totalDays: _calendarCom.getDays(),
      });
      this.attendanceDefaultDays();
    }
  }

  render() {
    return (
      <div className="checkIn">
        <IceContainer>
          <RangePicker
            onChange={this.RangePickerFunc}
          />
          <span style={{ color: 'red', marginLeft: '25px' }}><b>时区日期数： {this.state.totalDays}天</b></span>
          <span style={{ color: 'green', marginLeft: '25px' }}>时区打卡数： {this.state.attendances}</span>
          <span style={{ color: '#f20850', marginLeft: '25px' }}>时区派单数： {this.state.dispathDays}</span>
          <Calendar
            onChange={this.checkIn}
            dateCellRender={this.dataCellRender}
          />
          <WrappedDialogForm
            ref="dialog"
            fpmc={fpmc}
            UserService={UserService}
            Toast={Toast}
            handleSubmitOk={this.fetchDatafromForm}
          />
        </IceContainer>
      </div>
    );
  }
}
