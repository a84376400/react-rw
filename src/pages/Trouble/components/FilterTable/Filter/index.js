import React, { Component } from 'react';
import { Input, Grid, Select, Button, DatePicker } from '@icedesign/base';

// form binder 详细用法请参见官方文档
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';
import FileDown from '../../FileDownload';
import fpmc from 'fpmc-jssdk';
import _ from 'lodash'

const { Row, Col } = Grid;
const { Option } = Select;

export default class Filter extends Component {
  constructor(props){
    super(props)
    this.state={}
  }
  componentDidMount(){
    new fpmc.Query('dvc_area')
      .sort('id+')
      .find()
      .then(data=>{
        const zoom = _.map(data,item=>{
          return _.pick(item, ['id', 'name'])
        })
        this.setState({zoom: zoom})
      })
  }

  render() {
    return (
      <IceFormBinderWrapper
        value={this.props.value}
        onChange={this.props.onChange}
      >
        <div>
          <Row wrap>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>开始时间</label>
              <IceFormBinder
                valueFormatter={(date, strValue) => {
                  return date.getTime();
                }}
              >
                <DatePicker name="startTime" style={styles.filterTool} />
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>结束时间</label>
              <IceFormBinder
                valueFormatter={(date, strValue) => {
                  return date.getTime();
                }}
              >
                <DatePicker name="endTime" style={styles.filterTool} />
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>异常类型</label>
              <IceFormBinder>
                <Select
                  name="code"
                  placeholder="请选择"
                  style={styles.filterTool}
                >
                  <Option value='t0' onClick={this.props.onSubmit}>所有</Option>
                  <Option value="t6" onClick={this.props.onSubmit}>摄像机异常</Option>
                  <Option value="t5" onClick={this.props.onSubmit}>防雷器异常</Option>
                  <Option value="t4" onClick={this.props.onSubmit}>柜门异常</Option>
                  <Option value="t3" onClick={this.props.onSubmit}>网络异常</Option>
                  <Option value="t2" onClick={this.props.onSubmit}>补光灯异常</Option>
                  <Option value="t1" onClick={this.props.onSubmit}>市电异常</Option>
                </Select>
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>故障区域</label>
              <IceFormBinder>
                <Select
                  name="area"
                  placeholder="请选择"
                  style={styles.filterTool}
                >
                  <Option key={0} value={0} onClick={this.props.onSubmit}>所有</Option>
                {
                  _.map(this.state.zoom,(item,index) =>{
                      return <Option key={index+1} value={index+1} onClick={this.props.onSubmit}>{item.name}</Option>  
                  })
                }
                </Select>
              </IceFormBinder>
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>处理状态</label>
              <IceFormBinder>
                <Select
                  name="status"
                  placeholder="请选择"
                  style={styles.filterTool}
                > <Option value='3' onClick={this.props.onSubmit}>所有</Option>
                  <Option value="2" onClick={this.props.onSubmit}>已处理</Option>
                  <Option value="1" onClick={this.props.onSubmit}>处理中</Option>
                  <Option value="0" onClick={this.props.onSubmit}>待处理</Option>
                </Select>
              </IceFormBinder>
            </Col>
          </Row>
          <div
            style={{
              textAlign: 'left',
              marginLeft: '12px',
            }}
          >
            <Button onClick={this.props.onReset} type="normal">
              重置
            </Button>
            <Button
              onClick={this.props.onSubmit}
              type="primary"
              style={{ marginLeft: '10px' }}
            >
              确定
            </Button>
            <FileDown
              api_url= 'http://114.220.74.133:9994/api/download'
              text= '一键下载'
              list={ this.props.dataSource }
            >
            </FileDown>
          </div>
        </div>
      </IceFormBinderWrapper>
    );
  }
}

const styles = {
  filterCol: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },

  filterTitle: {
    width: '68px',
    textAlign: 'right',
    marginRight: '12px',
    fontSize: '14px',
  },

  filterTool: {
    width: '200px',
  },
};
