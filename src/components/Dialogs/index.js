import React, { Component } from 'react';

import YDialog from './YDialog';

class CreateDialog extends Component {
    render() {
        return <YDialog title={ this.props.title || "新建" } {...this.props}/>
    }
}

class EditDialog extends Component {
    render() {
        return <YDialog title={ this.props.title || "编辑" } {...this.props}/>
    }
}

export { CreateDialog, EditDialog }
