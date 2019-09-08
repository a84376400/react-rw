import React, { Component } from 'react';
import fpmc from 'fpmc-jssdk';
import IceContainer from '@icedesign/container';
import { Feedback, Pagination } from '@icedesign/base';
import CustomTable from '../../Components/CustomTable';
import WrappedDeviceForm from './WrappedDeviceForm';
import WrappedDialogForm from '../../Devices/components/AddDeviceDialog/WrappedDialogForm';
import DeleteBallon from '../../Components/DeleteBalloon';
import SearchInput from '../components/SearchInput';

const Toast = Feedback.toast;

const initdata = [
  {
    name: '扬州1',
    id: '1',
  },
  {
    name: '扬州2',
    id: '2',
  },
];

// 这里设置分页显示数据行数
const rowCount = 10;

export default class TabTable extends Component {
  static displayName = 'TabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: initdata,
      total: 0,
    };

    // 设置列名
    this.columns = [
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
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
        width: 150,
      },
      {
        title: 'GPS',
        dataIndex: 'gps_lat',
        key: 'gps_lat',
        width: 250,
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        cellrender: (value, index, record) => {
          return (
            <span>
              <WrappedDeviceForm
                fpmc={fpmc}
                handleSubmitOk={this.modifyValues}
                index={index}
                record={record}
                maxBodyHeight={600}
              />
              <DeleteBallon
                handleRemove={
                  () => this.handleRemove(value, index, record)
                }
              />
            </span>
          );
        },
      },
    ];
  }

  // 更新后通过数据驱动完成页面重新渲染

  modifyValues = (data, dataIndex) => {
    const { dataSource } = this.state;
    dataSource[dataIndex] = Object.assign(dataSource[dataIndex], data);
    this.setState({
      dataSource,
    });
  }

  // 插入数据并完成页面重新渲染

  insertNewValues = (values) => {
    const { dataSource } = this.state;
    dataSource.unshift(values);

    // length 后面的值要与 页面显示条数统一

    if (dataSource.length > rowCount) {
      dataSource.pop();
    }
    this.setState({
      dataSource,
    });
  }

  componentDidMount() {
    // 初始值为第一页
    this.fetchData(1);
  }

  changePage = (page) => {
    this.fetchData(page);
  }


  // 获取表单数据
  fetchData = (page, searchKey) => {
    const tabName = 'dvc_device';

    const q = new fpmc.Query(tabName).sort('name+');

    if (searchKey && searchKey !== '') {
      q.condition(`name like '%${searchKey}%'`);
    }
    /*
    page() 提供了分页功能， 第一个参数是页码，
    第二个是每页数据条数
    如果注释掉这行，则会返回所有数据
    */
    q.page(page, rowCount);

    // findAndCount() 的返回值是 Promise
    q.findAndCount().then((data) => {
      // console.log(data.rows[0]['name'])
      this.setState({
        dataSource: data.rows,
        total: data.count,
      });
    })
      .catch((err) => {
        Toast.error(err.message || '网络错误，请稍后重试');
      });
  }

  handleRemove = (value, index) => {
    const { dataSource } = this.state;
    const row = dataSource[index];
    const o = new fpmc.Object('dvc_device');
    o.remove(row.id)
      .then((data) => {
        console.log(data, ' is removed!');
        Toast.success('操作成功');
        dataSource.splice(index, 1);
        this.setState({
          dataSource,
        });
      })
      .catch((err) => {
        Toast.error(err.message || '系统错误,请稍后重试');
      });
  };

  dataForSearchResult = (Key) => {
    this.fetchData(1, Key);
  }

  render() {
    const { total, dataSource } = this.state;
    // console.info(total, dataSource)
    return (
      <div className="tab-table">
        <IceContainer>
          <div>
            <WrappedDialogForm
              fpmc={fpmc}
              handleSubmitOk={this.insertNewValues}
            />
            <SearchInput
              fpmc={fpmc}
              toast={Toast}
              dataForSearchResult={this.dataForSearchResult}
            />
          </div>
          <CustomTable
            dataSource={dataSource}
            columns={this.columns}
            hasBorder={false}
            refresh={this.fetchData}
            maxBodyHeight={600}
          />
          <Pagination style={{ marginTop: '5px' }}
            total={total}
            shape="arrow-only"
            onChange={this.changePage}
            pageSize={rowCount}
          />
        </IceContainer>
      </div>
    );
  }
}
