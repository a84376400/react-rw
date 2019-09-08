/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination, Feedback, Dialog, Button } from '@icedesign/base';
import IceLabel from '@icedesign/label';
import IceContainer from '@icedesign/container';
import PubSub from 'pubsub-js'
import FilterForm from './Filter';

import { CustomTable, TableToolbar } from '../../../../components';
import { CreateDialog, EditDialog } from '../../../../components/Dialogs';
import fpmc from 'fpmc-jssdk';
import FeedbackForm from '../FeedbackForm'

const Toast = Feedback.toast;

export default class EnhanceTable extends Component {

  searchKey = undefined
    columns = [
      {
        title: '工单编号',
        dataIndex: 'code',
        key: 'code',
        width: 150,
      },
      {
        title: '问题描述',
        dataIndex: 'message',
        key: 'message',
        width: 300,
      },
      {
        title: '点位名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },
      {
        title: '运维单位',
        dataIndex: 'company',
        key: 'company',
        width: 150,
      },
      {
        title: '工单状态',
        dataIndex: 'status',
        key: 'status',
        render: (value, index, record) =>{
          if(record.status == 'FIXED'){
            return(
              <IceLabel status="success">已处理</IceLabel>
            )
          }else if(record.status == 'TODO'){
            return(
              <IceLabel status="danger">待处理</IceLabel>
            )
          }else if(record.status == 'DOING'){
            return(
              <IceLabel status="info">处理中</IceLabel>
            )
          }
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <Button type="primary" 
              size="small" onClick={ () => {
              this.setState({
                updateItem: {
                  index,
                  record,
                },
                updateDialogVisible: true,
              })
            } }>更新</Button>
            );
        },
      },
    ];

  constructor(props) {
    super(props);

    // 请求参数缓存
    this.queryCache = {};
    this.state = {
      filterFormValue: {},
      dataSource: {} ,
      updateItem: {},
      updateDialogVisible: false,
    };
    
  }

  componentDidMount() {
    this.queryCache.page = 1;
    this.fetchData();

    this.pubsub_token = PubSub.subscribe('PubSubmessag', (topic,message) => {
        if(message == 'ok'){
          this.fetchData();
        }
    });
  }

  componentWillUnmount(){
    PubSub.unsubscribe(this.pubsub_token);
  }


  fetchData = (page) => {
    new fpmc.Func('worksheet.list')
      .invoke(this.queryCache)
      .then((data) => {
        this.setState({
          dataSource: data ,
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


  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
  };

  hideDialog = () =>{
    this.setState({
      updateDialogVisible: false,
    })
  }
  onFeedback = () => {
    // feedback
    const { handleSubmit } = this.refs.feedbackForm;
    handleSubmit();
  }
  

  renderStatus = (value) => {
    return (
      <div inverse={false} status="default">
        {value}
      </div>
    );
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

    this.fetchData();
  };

  filterFormChange = (value) => {
    this.setState({
      filterFormValue: value,
    });    
  };

  filterTable = () => {
    // 合并参数，请求数据
    this.queryCache = {
      ...this.queryCache,
      ...this.state.filterFormValue,
    };
    this.fetchData();
  };

  resetFilter = () => {
    this.setState({
      filterFormValue: {
        keywords: '',
        status: '',
      },
    },
    );
    this.queryCache = {};
    this.fetchData();
  };

  modifyValues = (values, dataIndex) => {
    const { dataSource } = this.state;
    values = Object.assign(dataSource.rows[dataIndex], values)
    dataSource.rows[dataIndex] = values;
    this.setState({
      dataSource
    })
    this.hideDialog();
  }

  render() {
    const { dataSource } = this.state;
    const { filterFormValue, updateItem, updateDialogVisible } = this.state;
    return (
      <div className="filter-table">
        <IceContainer title="">
          <FilterForm
            value={filterFormValue}
            onChange={this.filterFormChange}
            onSubmit={this.filterTable}
            onReset={this.resetFilter}
          />
        </IceContainer>
        <Dialog title="更新"
          
          visible={ updateDialogVisible }
          onOk={ this.onFeedback }
          onClose={this.hideDialog}
          closable="esc,mask,close"
          onCancel={this.hideDialog}
          >
          <FeedbackForm
            ref="feedbackForm"
            index={ updateItem.index}
            worksheet={ updateItem.record }
            handleSubmitOk={ this.modifyValues }
          />
        </Dialog>
        <IceContainer>
          <h1>{this.state.ceshi}</h1>
          <CustomTable
            dataSource={dataSource.rows}
            columns={this.columns}
            hasBorder={false}
            maxBodyHeight={600}
          />
  
          <Pagination style={{ marginTop: '5px' }} shape="arrow-only" onChange={this.changePage}
            total={ dataSource.count } pageSize={ 10 }  />

        </IceContainer>
      </div>
    );
  }
}

const styles = {
  filterTableOperation: {
    lineHeight: '28px',
  },
  operationItem: {
    marginRight: '12px',
    textDecoration: 'none',
    color: '#5485F7',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px',
  },
  paginationWrapper: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};