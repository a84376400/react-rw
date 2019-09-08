import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Feedback, Button, Icon, Input, Field, Form,Pagination } from "@icedesign/base";
import { CustomTable, SearchBar, TableToolbar } from '../../../../components';

import CustomBreadcrumb from '../../../../components/CustomBreadcrumb';

import { Table } from '@icedesign/base';
import { Dialog } from '@icedesign/base';

import IceContainer from '@icedesign/container';
import fpmc from 'fpmc-jssdk';
import { DeleteBalloon } from '../../../../components/Balloons';
import { CreateDialog, EditDialog } from '../../../../components/Dialogs';
import SettingsForm from './SettingsForm.js';

const Toast = Feedback.toast;

//设置列表模拟数据
const MOCK_DATA = [
{ id: 1, code: 'C001', title: '主板温度预警', grade: '警报', message: ' 主板温度超过安全值', codeReturnMes: '主板温度恢复正常' },
{ id: 2, code: 'C002', title: '主板温度报送', grade: '信息', message: ' 当前主板温度在安全值', codeReturnMes: '当前主板温度正常，温度为30度', }];

export default class TabTable extends Component {
  searchKey = undefined
    columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '指令编码',
        dataIndex: 'code',
        key: 'code',
        width: 120,
      },
      {
        title: '指令标题',
        dataIndex: 'title',
        key: 'title',
        width: 150,
      },
      {
        title: '指令等级',
        dataIndex: 'grade',
        key: 'grade',
        width: 100,
      },
      {
        title: '指令信息',
        dataIndex: 'message',
        key: 'message',
        width: 400,
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog>
                <SettingsForm index={index}
                  record={record}
                   handleSubmitOk={this.modifyValues} />
              </EditDialog>
              <DeleteBalloon
                handleRemove={() => this.handleRemove(value, index, record)}
              />
            </span>
          );
        },
      },
    ];
  constructor(props) {
    super(props);
    this.state = {
      dataSource: MOCK_DATA,
      total: MOCK_DATA.length,
      page: 1,
    };
    
  }

  fetchData = (page) => {
    const q = new fpmc.Query('opt_info');
    q.page(page, 10);
    if(this.searchKey && this.searchKey != ''){
      console.info(this.searchKey)
      q.condition(`name like '%${this.searchKey}%'`)
    }
    q.findAndCount().then(data=>{
      this.setState({
        dataSource: data.rows,
        total: data.count,
        page,
      });
    })
    .catch(err => {
      Toast.error(err.message || '系统错误,请稍后重试');
    })
  }

  componentDidMount(){
    this.fetchData(1)
  }

  changePage = (page) =>{
    this.fetchData(page || this.state.page)
  }


  modifyValues = (values, dataIndex) => {
    const { dataSource } = this.state;
    dataSource[dataIndex] = values;
    this.setState({
      dataSource,
    });
  };

  insertNewValues = (values) => {
    let { dataSource, total } = this.state;
    total = total + 1;
    dataSource.unshift(values);
    if(dataSource.length > 10){
      dataSource.pop();
    }
    this.setState({
      dataSource,
      total,
    });
  }

  handleRemove = (value, index, record) => {
    const o = new fpmc.Object('opt_info');
    o.remove(record.id)
      .then(data => {
        Toast.success('操作成功');
        this.changePage();
      })
      .catch(err => {
        Toast.error(err.message || '系统错误,请稍后重试');
      })
    
  };

  handleSearch = (obj) => {
    const { key } = obj
    this.searchKey = key
    this.fetchData(1)
  }

  render() {
    return (
      <div className="tab-table">
        <IceContainer>
          <TableToolbar>
            <CreateDialog>
              <SettingsForm handleSubmitOk={this.insertNewValues}/>
            </CreateDialog>
            <SearchBar onSearch={this.handleSearch}/>
          </TableToolbar>
          
          <CustomTable
            dataSource={this.state.dataSource}
            columns={this.columns}
            hasBorder={false}
          />
          <Pagination style={ {marginTop: '5px'} } shape="arrow-only" onChange={this.changePage} total={ this.state.total } pageSize={ 10 }  />
        </IceContainer>
      </div>
    );
  }

}