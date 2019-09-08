import React, { Component } from 'react';
import { Button, Dialog, Icon } from '@icedesign/base';

export default (WrappedForm) => {
  return class MyDefinedDialog extends Component {
    static displayName = 'EditDialog';

    static defaultProps = [];

    constructor(props) {
      super(props);
      this.state = {
        visible: false,
      };
    }

    handleSubmit = () => {
      this.refs.wrappedComponent.handleSubmit();
      this.setState({
        visible: false,
      });
    }

    onOpen = () => {
      this.setState({
        visible: true,
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
          <Button
            size="large"
            onClick={() => this.onOpen()}
          >
            <Icon type="add"/>添加
          </Button>
          <Dialog
            style = {{ width: 640 }}
            visible={ this.state.visible }
            onOk={this.handleSubmit}
            closable="esc,mask,close"
            onCancel={this.onClose}
            onClose={this.onClose}
            title="添加"
          >
            <WrappedForm ref="wrappedComponent" {...this.props} />
          </Dialog>
        </div>
      )
    }
  }
}

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  }
}
