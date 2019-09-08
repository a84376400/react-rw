import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Pagination, Feedback, Dialog, Button } from '@icedesign/base';
import BalloonConfirm from '@icedesign/balloon-confirm';
import fpmc from 'fpmc-jssdk';
import { CustomTable, SearchBar, TableToolbar } from '../../../../components';
import { DisableBalloon, EnableBalloon } from '../../../../components/Balloons';
import { CreateDialog, EditDialog } from '../../../../components/Dialogs';
import UserCreateForm from './UserCreateForm.js';


const Toast = Feedback.toast;

export default class TabTable extends Component {

  searchKey = undefined;
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
      title: '公司',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (value, index, record) => {
        return (
          <span>
            <BalloonConfirm 
              title="密码重置，将导致原有密码不可登录，请确认是否重置？"
              onConfirm = { () => this.handleReset(value, index, record) } >
              <Button>重置密码</Button>
            </BalloonConfirm> &nbsp;
            {
              record.enable === 1?(
              <DisableBalloon
                handleDisable={() => this.handleDisable(value, index, record)}
              />):(
              <EnableBalloon
                handleEnable={() => this.handleEnable(value, index, record)}
              />
              )
            }
            
            </span>
          );
       
      },
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      dataSource: { rows: [], count: 0 },
    };
    
    
  }

  fetchData = (page) => {
    let params = { page, obsCode: 'SUBCOMPANY' }
    // console.log(this)
    if (this.searchKey && this.searchKey !== '') {
      params.searchKey = this.searchKey;
    }
    new fpmc.Func('user.list')
      .invoke(params)
      .then((data) => {
        this.setState({
          dataSource: data,
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
    const { dataSource } = this.state;
    dataSource.rows[dataIndex] = values;
    this.setState({
      dataSource,
    });
  };
  

  insertNewValues = (values) => {
    let { dataSource } = this.state;
    const rows = dataSource.rows;
    dataSource.count = dataSource.count + 1;
    rows.unshift(values);
    if(rows.length > 10){
      rows.pop();
    }
    this.setState({
      dataSource,
    });
  }

  handleReset = (value, index, record) => {
    new fpmc.Func('user.resetPassword')
      .invoke({ id: record.id })
      .then( (data) =>{
        Toast.success(`密码已重置,新密码为: ${data}! 请登录后及时修改新密码！`)
      })
      .catch(err=>{
        Toast.error(err.message || '系统错误,请稍后重试');
      })
  }

  handleDisable = (value, index, record) => {
    const { dataSource } = this.state;
    dataSource.rows[index].enable = 0;
    const { id } = dataSource.rows[index];
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
    const { dataSource } = this.state;
    dataSource.rows[index].enable = 1;
    const { id } = dataSource.rows[index];
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

  handleSearch = (obj) => {
    const { key } = obj;
    this.searchKey = key;
    this.fetchData(1)
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <IceContainer>

          <TableToolbar>
            <CreateDialog>
              <UserCreateForm handleSubmitOk={this.insertNewValues} />
            </CreateDialog>
            <SearchBar onSearch={this.handleSearch} />
          </TableToolbar>
          <CustomTable
            dataSource={dataSource['rows']}
            columns={this.columns}
            hasBorder={false}
          />
          <Pagination style={{ marginTop: '5px' }} shape="arrow-only" onChange={this.changePage}
            total={ dataSource.count } pageSize={ 10 }  />

        </IceContainer>
      </div>
    );
  }
}
