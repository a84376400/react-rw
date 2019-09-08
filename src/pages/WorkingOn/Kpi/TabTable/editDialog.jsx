import React, { Component } from 'react';
import { Dialog } from '@icedesign/base';

export default (WrappedForm) => {
  return class MyDefinedDialog extends Component {
    static displayName = 'EditDialog';

    static defaultProps = [];

    constructor(props) {
      super(props);
      this.state = {
        visible: false,
        nextState: {},
      };
    }

    handleSubmit = () => {
      const dd = this.state.nextState.value._d;
      this.refs.wrappedComponent.handleSubmit(dd);
      this.setState({
        visible: false,
      });
    }

    onOpen = (nextState) => {
      this.setState({
        visible: true,
        nextState,
      });
    };

    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    render() {
      return (
        <div style={styles.createDailog}>
          <Dialog
            style={{ width: 640 }}
            visible={this.state.visible}
            onOk={this.handleSubmit}
            closable="esc,mask,close"
            onCancel={this.onClose}
            onClose={this.onClose}
            title="补打卡申请"
          >
            <WrappedForm ref="wrappedComponent" {...this.props} />
          </Dialog>
        </div>
      );
    }
  }
}

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
};
