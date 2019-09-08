import React, { Component } from 'react';
import { Search } from '@icedesign/base';


const obs = [];
export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.fpmc = this.props.fpmc;
    this.toast = this.props.toast;
    this.state = {
      dataSource:
      [
        {
          label: '扬州东',
          value: '扬州东',
        },
        {
          label: '扬州南',
          value: '扬州南',
        },
        {
          label: '扬州西',
          value: '扬州西',
        },
        {
          label: '扬州北',
          value: '扬州北',
        },
      ],
      // 这是search input 输入的值
      value: '',
    };
  }

  onClearClick = () => {
    this.setState({
      value: '',
    });
  }


  // input 输入时触发
  onChange = (value) => {
    this.dataforSearch(value);
  }

  // 只执行一次
  runOnce = (callback, context) => {
    return function () {
      try {
        callback.apply(context || this);
      } catch (e) {
        // console.log('数据只查询一次', '已强制去重');
        return;
      } finally {
        callback = null;
      }
    };
  }

  // 从数据库获取dataSource 且用runOnce 限制只能执行一次
  dataforSearch = this.runOnce(() => {
    const q = new this.fpmc.Query('dvc_device');
    q.find().then((rows) => {
      rows.map((row) => {
        obs.push({ label: row.name, value: row.name, disabled: false });
        return obs;
      });
    })
      .catch((err) => {
        this.toast.error(err.message);
      });
  });


  // 在获取输入框焦点时进行查询
  onInputFocus = () => {
    this.dataforSearch();
    // console.log(obs);
    this.setState({
      dataSource: obs,
    });
  }

  onSearch = (obj) => {
    this.props.dataForSearchResult(obj.key);
    // console.log(obj.key);
    this.setState({
      value: obj.key,
    })
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <Search
          type="normal"
          onInputFocus={this.onInputFocus}
          hasClear={true}
          onSearch={this.onSearch}
          onChange={this.onChange}
          inputWidth={200}
          value={this.state.value}
          dataSource={this.state.dataSource}
          name="textName"
          searchText="搜索"
        />
        <br />
      </div>
    );
  }
}
