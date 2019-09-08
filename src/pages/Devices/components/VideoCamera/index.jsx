import React, { Component } from 'react';
import {
  Feedback,
  Loading
} from '@icedesign/base';
import { host, port } from '../../../../options.js';
import { Func } from 'fpmc-jssdk';
import videojs from 'video.js'
import 'video.js/dist/video-js.css';
// import '@videojs/http-streaming/dist/videojs-http-streaming.js';
// import '@videojs/http-streaming';
const Toast = Feedback.toast;
export default class extends Component {

    componentDidMount(){
      new Func('ffmpeg.run').invoke(this.props)
        .catch( error => { Toast.error(error.message || '视频源不稳定,请联系管理员!')})
    }

    componentWillUnmount(){
      
      new Func('ffmpeg.stop').invoke(this.props)  
        .then( data => {
          new Func('ffmpeg.info').invoke({})  
           .then(console.log)
        })
        .catch( error => { Toast.error(error.message || '视频源不稳定,请联系管理员!')})
    }

    render() {
      Toast.show({
        type: "loading",
        content: "正在转换视频流, 大约需要10~15秒钟的时间，请耐心等待"
      });
      // ffmpeg -rtsp_transport tcp -i rtsp://admin:admin123@192.168.100.211:554/h264/ch1/main/av_stream -f flv -r 25 -s 1960*1280 -an rtmp://192.168.1.118:1935/live/test
      const src = `http://${ host == 'localhost'? '192.168.100.196': host }:9080/live/${this.props.streamId || 'test'}.m3u8`
      
      const videoJsOptions = {
        autoplay: false,
        controls: true,
        width: this.props.width || 360,
        height: this.props.height || 360,
        sources: [{
          src,
          type: 'application/x-mpegURL'
        }]
      }
      return (
        
        <div style={styles.monitor}>
          <VideoPlayer { ...videoJsOptions } />
        </div>
        
      )

    }
}

const styles = {
  monitor: {
    border: '1px solid #eee',
    padding: '1px',
    minHeight: '360px',
    background: '#000'
  }
}



class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    setTimeout(() => {
      const { sources, autoplay, width, height } = this.props;
      this.player = videojs(this.videoNode, { autoplay, width, height }, () =>{
        this.player.src(sources);
        this.player.play();
        
      });
    }, 15000)
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div>    
        <div data-vjs-player style={{ margin: '0 auto', width: '100%'}}>
          <video ref={ node => this.videoNode = node } className="video-js vjs-default-skin vjs-big-play-centered"></video>
        </div>
      </div>
    )
  }
}