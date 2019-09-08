/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { moment, Pagination, Dialog } from '@icedesign/base';
import IceLabel from '@icedesign/label';
import IceContainer from '@icedesign/container';
import FilterForm from './Filter';
import { CustomTable } from '../../../../components';

import { Query } from 'fpmc-jssdk';

export default class extends Component {

  constructor(props) {
    super(props);

    // 请求参数缓存
    this.queryCache = {};
    this.state = {
      filterFormValue: {},
      visible: false,
      tableData: {
        total: 0,
        pageSize: 10,
        currentPage: 1,
        list: []
      }
    };

    this.columns = [
      {
        title: '点位名称',
        dataIndex: 'device',
        key: 'device',
      },
      {
        title: '设备SN',
        dataIndex: 'sn',
        key: 'sn',
        width: 150,
      },
      {
        title: '等级',
        width: 100,
        render: (value, index, record)=>{
          return  <IceLabel inverse={false} status="warning">告警</IceLabel>;
        }
      },
      {
        title: '告警内容',
        dataIndex: 'title',
        key: 'title',

      },
      {
        title: '告警时间',
        dataIndex: 'createAt',
        key: 'createAt',
        render: (value, index, record)=>{
          return moment(parseInt(record.createAt)).format('YYYY-MM-DD HH:mm');
        }
      },
    ];
  }

  componentDidMount() {
    this.queryCache.page = 1;
    this.fetchData();
  }

  fetchData = () => {
    const { startTime, endTime } = this.queryCache;
    console.log(startTime,endTime)
    let condition = ' 1 = 1 ';
    if(startTime){
      condition += ` and createAt >= ${ startTime }`;
    }
    if(endTime){
      condition += ` and createAt <= ${ endTime }`;
    }
    new Query('(SELECT (select name from dvc_device where sn = a.sn) as device, a.* FROM `dvc_alarm` a) as alarm')
      .condition(condition)
      .page(this.queryCache.page, 10)
      .sort('id+')
      .findAndCount()
      .then(rsp => {
        this.setState({
          tableData: {
            total: rsp.count,
            pageSize: 10,
            currentPage: this.queryCache.page,
            list: rsp.rows
          }
        })
      })
  };

  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
  };


  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

    this.fetchData();
  };

  filterFormChange = (value) => {
    this.queryCache.page = 1;
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
      filterFormValue: {},
    });
  };

  render() {
    const { filterFormValue, tableData } = this.state;
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
        <IceContainer>
          <CustomTable
            dataSource={tableData.list}
            className="basic-table"
            style={styles.basicTable}
            columns={this.columns}
            hasBorder={false}
            maxBodyHeight={600}
          >

          </CustomTable>
          <div style={styles.paginationWrapper}>
            <Pagination
              current={tableData.currentPage}
              pageSize={tableData.pageSize}
              total={tableData.total}
              onChange={this.changePage}
            />
          </div>
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
