import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Pagination, Feedback } from '@icedesign/base';
import moment from 'moment';
import fpmc from 'fpmc-jssdk';
import { CustomTable, SearchBar, TableToolbar } from '../../../../../components';
import { DisableBalloon, EnableBalloon } from '../../../../../components/Balloons';
import { CreateDialog } from '../../../../../components/Dialogs';
// import UserSettingForm from './UserSettingForm.js';
import UserCreateForm from './UserCreateForm.js';

const Toast = Feedback.toast;

const TabPane = Tab.TabPane;

const tabs = [{ tab: '全部', key: 'all' }];

export default class TabTable extends Component {

  searchKey = undefined
    columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 100,
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 120,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 120,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 250,
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        width: 150,
        render: (value, index, record) => {
          const time = moment(record.createAt)
          return (
            <span>{time.format('YYYY-MM-DD')}</span>
          )
        }
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        render: (value, index, record) => {
          if(record.enable === 1){
            return (
              <span>
                {/* <EditDialog>
                  <UserSettingForm index={index}
                    record={record}
                    handleSubmitOk={this.modifyValues} />
                </EditDialog> */}
                <DisableBalloon
                  handleDisable={() => this.handleDisable(value, index, record)}
                />
              </span>
            );
          }
          return (
              <span>
                <EnableBalloon
                  handleEnable={() => this.handleEnable(value, index, record)}
                />
              </span>
            );
        },
      },
    ];

  constructor(props) {
    super(props);
    this.state = {
      dataSource: { 'all' : []},
      tabKey: 'all',
    };
  }

  fetchData = (page) => {
    let params = { page}
    // console.log(this)
    if (this.searchKey && this.searchKey !== '') {
      params.searchKey = this.searchKey;
      console.log(params)
    }
    new fpmc.Func('user.list')
      .invoke(params)
      .then((data) => {
        this.setState({
          dataSource: { all: data },
        });
      })
      .catch(err=>{
        Toast.error(err.message || '系统错误,请稍后重试');
      })
  }
  
  componentWillMount() {
    this.fetchData(1)
  }
  changePage = (page) =>{
    this.fetchData(page)
  }

  modifyValues = (values, dataIndex) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].rows[dataIndex] = values;
    this.setState({
      dataSource,
    });
  };

  insertNewValues = (values) => {
    let { dataSource, tabKey } = this.state;
    const rows = dataSource[tabKey].rows;
    dataSource[tabKey].count = dataSource[tabKey].count + 1;
    rows.unshift(values);
    if(rows.length > 10){
      rows.pop();
    }
    this.setState({
      dataSource,
    });
  }

  handleDisable = (value, index, record) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].rows[index].enable = 0;
    const { id } = dataSource[tabKey].rows[index];
    new fpmc.Func('user.toggleEnable')
      .invoke({ id, enable: 0 })
      .then( () =>{
        this.setState({
          dataSource,
        });
      })
      .catch(err=>{
        Toast.error(err.message || '系统错误,请稍后重试');
      })
    
  };

  handleEnable = (value, index, record) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].rows[index].enable = 1;
    const { id } = dataSource[tabKey].rows[index];
    new fpmc.Func('user.toggleEnable')
      .invoke({ id, enable: 1 })
      .then( () =>{
        this.setState({
          dataSource,
        });
      })
      .catch(err=>{
        Toast.error(err.message || '系统错误,请稍后重试');
      })
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  handleSearch = (obj) => {
    const { key } = obj;
    this.searchKey = key;
    this.fetchData(1)
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <IceContainer style={{ padding: '0 20px 20px' }}>
          <Tab onChange={this.handleTabChange}>
            {tabs.map((item) => {
              return (
                <TabPane tab={item.tab} key={item.key}>
                  <TableToolbar>
                    <CreateDialog>
                      <UserCreateForm handleSubmitOk={this.insertNewValues} />
                    </CreateDialog>
                    <SearchBar onSearch={this.handleSearch} />
                  </TableToolbar>
                  <CustomTable
                    dataSource={dataSource[this.state.tabKey]['rows']}
                    columns={this.columns}
                    hasBorder={false}
                  />
                  <Pagination style={{ marginTop: '5px' }} shape="arrow-only" onChange={this.changePage}
                   total={ dataSource[this.state.tabKey].count } pageSize={ 10 }  />
                </TabPane>
              );
            })}
          </Tab>
        </IceContainer>
      </div>
    );
  }
}
