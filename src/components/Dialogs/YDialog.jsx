import React, { Component } from 'react';
import { Dialog, Button } from '@icedesign/base';

export default class YDialog extends Component {

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleSubmit = () => {
    this.refs.form.handleSubmit()
  };

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
    const form = this.props.children;
    return (
      <div style={styles.createDialog}>
        {
          this.props.isMenu? (<a
            onClick={() => this.onOpen()}
          >
            {this.props.title}
          </a>): (<Button
          size="small"
          type={ this.props.buttonType || "primary"}
          onClick={() => this.onOpen()}
        >
          {this.props.title}
        </Button>)
        }
        
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title={this.props.title}
        >
        {
          React.cloneElement(form, {ref:"form", handleClose:this.onClose})
        }
        </Dialog>
      </div>
    );
  }
}

const styles = {
  createDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
};
