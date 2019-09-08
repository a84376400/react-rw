import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button , Icon} from '@icedesign/base';
import { time } from 'highcharts';

export default class FileDown extends Component{
  constructor(props){
    super(props)
    this.state = {
      loadingStatus: true,
      buttonDisabled: false
    }
  }

  //文件下载操作
  handleDownFile = (event, api_url, list) => {
    event.preventDefault()
    event.stopPropagation()
    //开启loading 按钮职灰色
    this.setState({
      loadingStatus: false,
      buttonDisabled: true,
    })
    fetch(api_url,{
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      mode: 'cors',
      body: JSON.stringify(list)
    }).then(response => {
      response.blob().then(blob => {
        //关闭loading 按钮恢复正常
        this.setState({
          loadingStatus: true,
          buttonDisabled: false,
        })
        let blobUrl = window.URL.createObjectURL(blob)
        const filename = 'demo' + '.xlsx'
        const aElement = document.createElement('a')
        document.body.appendChild(aElement)
        aElement.style.display = 'none'
        aElement.href = blobUrl
        aElement.download = filename
        aElement.click()
        document.body.removeChild(aElement)
      })
    }).catch(error=>{
      this.setState({
        loadingStatus: false,
        buttonDisabled: false
      })
      console.log('文件下载失败',error)
    })
  }

  render() {
    const { api_url, text, list } = this.props
    const { loadingStatus, buttonDisabled } = this.state
    return (
      <Button
        type="primary"
        style={{ float: 'right'}}
        onClick={event => { this.handleDownFile(event, api_url, list)}}
        disabled={buttonDisabled}
      >
        <Icon type={loadingStatus ? 'download':'loading'} />
        { loadingStatus ? text: '下载中'}
      </Button>
    )
  }
}