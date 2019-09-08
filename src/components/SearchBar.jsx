import React, { Component } from 'react';
import { Search } from "@icedesign/base";
import './Styles.scss';

export default class SearchBar extends Component {

    render() {
        const props = Object.assign({
            inputWidth: 200,
            searchText: "",
            type: "normal",
            placeholder: "请输入您要搜索的信息",
            name: "searchInput",
        }, this.props);
        return (
            <div style={{display: 'inline-block', float: 'right'}} className="search-bar-container">
                <Search {...props} />
            </div>
        )
    }
}