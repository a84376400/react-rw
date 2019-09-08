import React, { Component } from 'react';
import { Button, Balloon } from '@icedesign/base';
import PropTypes from 'prop-types';

export default class EnableBalloon extends Component {
  static propTypes = {
    handleEnable: PropTypes.func,
  };

  static defaultProps = {
    handleEnable: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleHide = (visible, code) => {
    if (code === 1) {
      this.props.handleEnable();
    }
    this.setState({
      visible: false,
    });
  };

  handleVisible = (visible) => {
    this.setState({ visible });
  };

  render() {
    const trigger = (
      <Button size="small" type="primary">
        启用
      </Button>
    );

    const content = (
      <div>
        <div style={styles.contentText}>确认启用？</div>
        <Button
          id="confirmBtn"
          size="small"
          type="primary"
          style={{ marginRight: '5px' }}
          onClick={visible => this.handleHide(visible, 1)}
        >
          确认
        </Button>
        <Button
          id="cancelBtn"
          size="small"
          onClick={visible => this.handleHide(visible, 0)}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Balloon
        trigger={trigger}
        triggerType="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisible}
      >
        {content}
      </Balloon>
    );
  }
}

const styles = {
  contentText: {
    padding: '5px 0 15px',
  },
};
