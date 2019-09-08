import _ from 'lodash';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import IceContainer from '@icedesign/container';
import { Feedback, Button, Icon, Pagination } from "@icedesign/base";
import { CustomTable, SearchBar, TableToolbar} from '../../../../components';
import { DeleteBalloon } from '../../../../components/Balloons';
import { CreateDialog, EditDialog } from '../../../../components/Dialogs';

import fpmc from 'fpmc-jssdk';
import SettingsForm from './SettingsForm.js';

const Toast = Feedback.toast;

const MOCK_DATA = [
  {
    name: '扬州1',
    id: '1',
  },
  {
    name: '扬州2',
    id: '2',
  },
];

export default class TabTable extends Component {
  searchKey = undefined
  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '温度阀值,单位(°C)',
      render: ( value, index, record ) => { 
        if(!record.setting)
          return <span>---</span>
        if(record.setting.temprature)
          return <span>{ record.setting.temprature.min } ~ { record.setting.temprature.max }</span> 
        return <span>---</span>
        }
    },
    {
      title: '电压阀值,单位(V)',
      render: ( value, index, record ) => { 
        if(!record.setting)
          return <span>---</span>
        if(record.setting.voltage)
          return <span>{ record.setting.voltage.min } ~ { record.setting.voltage.max }</span> 
        return <span>---</span>
        }
    },
    {
      title: '电流阀值,单位(mA)',
      render: ( value, index, record ) => { 
        if(!record.setting)
          return <span>---</span>
        if(record.setting.electric)
          return <span>{ record.setting.electric } </span> 
        return <span>---</span>
        }
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
    const q = new fpmc.Query('dvc_area');
    q.page(page, 10);
    if(this.searchKey && this.searchKey != ''){
      q.condition(`name like '%${this.searchKey}%'`)
    }
    q.findAndCount().then(data=>{
      const rows = _.map(data.rows, d => {
        return _.assign(d, { setting: JSON.parse(d.setting)})
      })
      this.setState({
        dataSource: rows,
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
    const o = new fpmc.Object('dvc_area');
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
              <SettingsForm handleSubmitOk={this.insertNewValues} />
            </CreateDialog>
            <SearchBar onSearch={this.handleSearch} />
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
