/* eslint no-underscore-dangle: 0 */
import React, {
  Component
} from 'react';
import {
  moment,
  Pagination,
  Dialog
} from '@icedesign/base';

import IceLabel from '@icedesign/label';
import IceContainer from '@icedesign/container';
import { rotateY } from 'gl-matrix/src/gl-matrix/quat';
import FilterForm from './Filter';


export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
        filterFormValue: {},
    };
  }

  filterFormChange = (value) => {
    this.setState({
      filterFormValue: value,
    });
    console.log(this.state.filterFormValue)
  };

  filterTable = () => {
    // 合并参数，请求数据
    this.queryCache = {
      ...this.queryCache,
      ...this.state.filterFormValue,
    };
    //this.fetchData();
  };

  resetFilter = () => {
    this.setState({
      filterFormValue: {},
    });
  };


  render(){
    const { filterFormValue} = this.state;
    return(
        <div className="query-table">
        <IceContainer title="">
          <FilterForm
            value={filterFormValue}
            onChange={this.filterFormChange}
            onSubmit={this.filterTable}
            onReset={this.resetFilter}
          />
        </IceContainer>
        </div>
    );
  }

}
