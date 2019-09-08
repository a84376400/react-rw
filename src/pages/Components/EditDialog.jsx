import React, { Component } from 'react';
import fpmc from 'fpmc-jssdk';
import { Button, Dialog } from '@icedesign/base';


export default (WrappedForm) => {
  return class MyDefinedDialog extends Component {
    static displayName = 'EditDialog';

    static defaultProps = []

    constructor(props) {
      super(props);
      this.state = {
        visible: false,
        dataIndex: null,
        dataSource: '',
      };
    }

    handleSubmit = () => {
      this.refs.wrappedComponent.handleSubmit();
      this.setState({
        visible:false,
      })
    }

    onOpen = (index, record) => {
      this.setState({
        visible: true,
        dataIndex: index,
      });
    };

    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    render() {
      const { index, record } = this.props;
      return (
        <div style={styles.editDialog}>
          <Button
            size="small"
            type="primary"
            onClick={() => this.onOpen(index, record)}
          >
            编辑
          </Button>
          <Dialog
            style={{ width: 640 }}
            visible={this.state.visible}
            onOk={this.handleSubmit}
            closable="esc,mask,close"
            onCancel={this.onClose}
            onClose={this.onClose}
            title="编辑"
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
