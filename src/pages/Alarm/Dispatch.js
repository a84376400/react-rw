import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Select, Input, DatePicker, TimePicker, Button, Field, Feedback } from '@icedesign/base';
import fpmc from 'fpmc-jssdk';
import PubSub from 'pubsub-js'
import './Dispatch.css'

const { Row, Col } = Grid;
const { Option } = Select;
const Toast = Feedback.toast;



export default class Dispatch extends Component {

  field = new Field(this);

  constructor(props){
    super(props);
    this.state ={
      areasel : [], //区域
      device : [],  //点位
      company : [], //运维单位
      staff : [],  //运维人员
      disabled: true,

      company_tip : true,
      staff_tip : true,

      refresh :'ok'
    }
  }


//获取运维单位
getCompany = () =>{
  let query = new fpmc.Query('usr_obs')
    .condition(`code = 'SUBCOMPANY'`);
    const company = this.state.company;
    const staff = this.state.staff;
    query.find()
    .then(function(data){
      data.map((item) =>{
        company.push(
          {
            label:item.name,
            value:item.id
          }
        );
      })
    })
    .catch(function(err){
      console.error(err);
    });
}



//获取点位
getDevice = () =>{
  let query = new fpmc.Query('dvc_device');
    const device = this.state.device;
    query.find()
    .then(function(data){
      data.map((item) =>{
        device.push(
          {
            label:item.name,
            value:item.id,
          }
        );
      })
    })
    .catch(function(err){
      console.error(err);
    });
}


setField = () =>{
  const item = this.props.item;
  console.log(item);
  this.field.setValues({
    code: item.code,
    dispatcher_id : item.username,
    device : item.gpsname,
    createAt : item.createAt,
    message : item.discribe,
    finishAt:'',
    remark:'',
    reason:'',
    });
}

componentWillMount(){
  this.getCompany();
  // this.getStaff();
  this.getDevice();

  this.setField(); //设置信息
}


  handleClose = () =>{
    // this.field.reset();
    this.props.closeDialog();
    console.log(this.props.item.sn);
  }

  handleSubmit = () =>{
    if(this.state.company_value == undefined){
      this.setState({
        company_tip : false,
        staff_tip : false
      })
      return false;
    }else if(this.state.staff_value == undefined){
      this.setState({
        staff_tip : false
      })
      return false;
    }else{

      console.log('公司id',this.state.company_value)
      console.log('员工id',this.state.staff_value)
    }

    const item = this.props.item;

    this.field.validate((errors, values) => {

      if (errors) {
        return;
      }

      values.duration = values.finishAt; //修复时长，小时
      values.troubleAt = values.createAt; //故障发生时间
      values.trouble_id = item.id; //故障编号
      values.sn = item.sn; //点位编码
      let dispatchAt=new Date().getTime();
      console.log(dispatchAt);

      let number = values.finishAt;  //手动输入的修复时长
      console.log(number);

      values.dispatcher_id = item.userId; //传值传入userid

      console.log(item.createAt);

      values.finishAt = number *60*60*1000 + item.createAt; //修复时间戳

      values.dispatchAt = dispatchAt; //派单时间戳

      values.company_id = this.state.company_value; //运维单位id

      values.staff_id = this.state.staff_value; //运维人员id
      console.log(values);

      // 在opt_worksheet创建工单
      let obj = new fpmc.Object('opt_worksheet');
      delete values.area_id;
      delete values.device; //删除原setValus 的device
      delete values.createAt;//删除原setValus 的createAt
			obj.set(values)
    			.create()
    			.then(function(data){
              console.log(data);
              Toast.success('操作成功');
    			}).catch(function(err){
              console.error(err);
              Toast.error(err.message || '系统错误,请稍后重试');
          });


      //在opt_trouble保存信息
      const id = item.id;
      console.log(id);
      const status = {status:1};
      let obj_save = new fpmc.Object('opt_trouble', { id });
      obj_save.save(status)
        .then((data)=>{
          console.info(data);
          Toast.success('操作成功');
          this.props.getDataSource();
        }).catch(function(err){
          console.error(err);
          Toast.error(err.message || '系统错误,请稍后重试');
        });
          PubSub.publish('PubSubmessag',this.state.refresh);
      this.handleClose();
    });
  }

  onSelect(value) {
  //获取运维人员
  let query = new fpmc.Query('usr_userinfo');
    const staff = [];

    query.condition(`dept = ${value}`)
      .find()
      .then(function(data){
        console.log(data)
        data.map((item) =>{
          staff.push(
            {
              label:item.title,
              value:item.id
            }
          );
        })
      })
      .catch(function(err){
        console.error(err);
      });


      console.log(this.state.staff);
      console.log(value);
      this.setState(
        {
          disabled : false,
          staff : staff,
          company_value : value,
          staff_value : undefined,
          company_tip: true
        }
      );
  }

  onChange(value) {
    this.setState({
      staff_value : value,
      staff_tip: true
    });
    console.log(value)
  }



  render(){
    const { init } = this.field;

    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return(
      // <span>1</span>
      <IceContainer>
        <div style={{width:'700px',margin:'0 auto'}}>
          <Row className="create-row">
            <Col span="4">
              <div className="create-tit">工单编号：</div>
            </Col>
            <Col span="8">
            <Input
              className="create-input"
              disabled={true}
              {...init('code')}
            />
            </Col>
            <Col span="4">
              <div className="create-tit required">
                <span>派单人：</span>
              </div>
            </Col>
            <Col span="8">
              <Input
                className="create-input"
                placeholder="请输入派单人"
                disabled={true}
                {...init('dispatcher_id',{
                  rules: {
                    required: true,
                    message: "请输入派单人",
                    trigger: ["onBlur", "onChange"]
                  }
                })}
              />
                {this.field.getError("dispatcher_id") ? (
                  <div style={{ color: "red" }}>
                    {this.field.getError("dispatcher_id").join(",")}
                  </div>
                  ) : (
                  ""
                  )}
            </Col>
          </Row>
          <Row className="create-row">

            <Col span="4">
                <div className="create-tit required">运维单位：</div>
            </Col>
            <Col span="8">
              <Select
                className="create-select"
                value={this.state.company_value}
                dataSource={this.state.company}
                onChange={this.onSelect.bind(this)}

              />
                {this.state.company_tip ? (
                  ''
                  ) : (
                    <div style={{ color: "red" }}>
                      <span>请选择运维单位</span>
                    </div>
                  )
                }
            </Col>
            <Col span="4">
              <div className="create-tit required">运维人员：</div>
            </Col>
            <Col span="8">
              <Select
                className="create-select"

                dataSource={this.state.staff}
                value={this.state.staff_value}
                onChange={this.onChange.bind(this)}
                disabled={this.state.disabled}


              />
                {this.state.staff_tip ? (
                  ''
                  ) : (
                    <div style={{ color: "red" }}>
                      <span>请选择运维人员</span>
                    </div>
                  )
                }
            </Col>
          </Row>

          <Row className="create-row">
            <Col  span="4">
              <div className="create-tit required">点位：</div>
            </Col>
            <Col span="8">
              <Select
                className="create-select"
                dataSource={this.state.device}
                disabled={true}
                {...init('device')}
              />
                {/* {this.field.getError("device") ? (
                  <div style={{ color: "red" }}>
                    {this.field.getError("device").join(",")}
                  </div>
                  ) : (
                  ""
                  )} */}
            </Col>
            <Col span="4">
              <div className="create-tit required">故障时间：</div>
            </Col>
            <Col span="8">
              <DatePicker
                className="create-date"
                showTime
                disabled={true}
                {...init('createAt')}
              />
            </Col>
          </Row>

          <Row className="create-row">
            <Col span="4">
              <div className="create-tit">故障描述：</div>
            </Col>
            <Col span="8">
              <Input
                className="create-input"
                placeholder="请输入故障描述"
                disabled={true}
                {...init('message')}
              />
            </Col>
            <Col span="4">
              <div className="create-tit">修复时长：</div>
            </Col>
            <Col span="8">
              <Input
                className="create-input time-input"
                placeholder="请输入修复时长"
                {...init('finishAt',{
                  rules: {
                    // required: true,
                    pattern:/^[0-9]*$/,
                    message: "请输入整数",
                    trigger: ["onBlur", "onChange"]
                  }
                })}
              />
              <span>小时</span>
              {this.field.getError("finishAt") ? (
                <div style={{ color: "red" }}>
                  {this.field.getError("finishAt").join(",")}
                </div>
                ) : (
                ""
                )}
            </Col>
          </Row>
          <Row className="create-row">
            <Col span="4">
              <div className="create-tit">故障原因：</div>
            </Col>
            <Col span="8">
              <Input
                multiple
                className="create-textarea"
                placeholder="请输入故障原因"
                {...init('reason')}
              />
            </Col>
            <Col span="4">
              <div className="create-tit">备注：</div>
            </Col>
            <Col span="8">
              <Input
                multiple
                className="create-textarea"
                placeholder="请输入备注"
                {...init('remark')}
              />
            </Col>
          </Row>
          <Row className="create-row-btn" style={{paddingTop:'20px'}}>

            <Col offset="8" span="4" style={styles.buttonBox}>
              <Button
                type="primary"
                onClick={this.handleSubmit}
              >
                <span>确定</span>
              </Button>
            </Col>
            <Col span="4" style={styles.buttonBox}>
              <Button
                type="normal"
                onClick={this.handleClose}
              >
                <span>取消</span>
              </Button>
            </Col>
          </Row>
        </div>

      </IceContainer>
    )
  }
}


const styles = {
  hint:{
    color:'#f00'
  },
  buttonBox:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
}
