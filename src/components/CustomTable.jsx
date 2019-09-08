import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from '@icedesign/base';

export default class CustomTable extends Component {
  static displayName = 'CustomTable';

  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array.isRequired,
  };

  static defaultProps = {
    dataSource: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderColumns = () => {
    const { columns } = this.props;
    return columns.map((item) => {
      if (typeof item.render === 'function') {
        return (
          <Table.Column
            key={ (item.id || item.key || item.title )}
            title={item.title}
            cell={item.render}
            width={item.width}
            align={item.align}
          />
        );
      }
      return (
        <Table.Column
          key={ (item.id || item.key || item.title)}
          title={item.title}
          dataIndex={item.dataIndex}
          width={item.width}
          align={item.align}
        />
      );
    });
  };
  render() {
    return <Table {...this.props} fixedHeader hasHeader={ this.props.hasHeader}>{this.renderColumns() }</Table>;
  }
}
