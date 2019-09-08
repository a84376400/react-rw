import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import IceContainer from '@icedesign/container';
import { Feedback, Button, Icon, Pagination } from "@icedesign/base";
import { CustomTable, SearchBar, TableToolbar} from '../../../../components';
import { DeleteBalloon, DisableBalloon, EnableBalloon } from '../../../../components/Balloons';
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
      title: '公司名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 250,
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
    const q = new fpmc.Query('usr_obs');
    q.page(page, 10);
    q.condition(`code = 'SUBCOMPANY'`);
    if(this.searchKey && this.searchKey != ''){
      q.condition(`code = 'SUBCOMPANY' and name like '%${this.searchKey}%'`)
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
    const o = new fpmc.Object('usr_obs');
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
  };

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
