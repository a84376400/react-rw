import React, { Component } from 'react';
export default class TableToolbar extends Component {

    render() {
        return (
            <div>
                {this.props.children}
                <div style={{clear: 'both'}}></div>
            </div>
        )
    }
}