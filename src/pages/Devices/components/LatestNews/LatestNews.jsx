import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { moment, Timeline } from '@icedesign/base';
import './LatestNews.scss';
import _ from 'lodash';

const {
  Item: TimelineItem
} = Timeline;

class BugNews extends Component {
  render() {
    return (
      <IceContainer className="latest-news" style={styles.cardContainer}>
        <Timeline>
          {this.props.data.map((item, index) => {
            return (
              <TimelineItem
                key={ `bug-${ index }` }
                title={ item.title }
                time = { moment(item.createAt).startOf('hour').fromNow() }
                state= { this.props.state || 'error' }
              />
            );
          })}
        </Timeline>
      </IceContainer>
    );
  }
};

class OperateRecord extends Component {

  render() {
    return (
      <IceContainer className="latest-news" style={styles.cardContainer}>
        <Timeline>
          {
            _.map(this.props.commands, command => {
              if(this.props.switcher['r' + command.unit])
                return (
                  <TimelineItem key={ `command_${command.id ? command.id : Math.random()}` } 
                    title={ `【${command.nickname}】 ${command.val == 1? '打开' : '关闭'}了 【 ${ this.props.switcher['r' + command.unit].name} 】`  } 
                    time={ command.createAt? moment(command.createAt).startOf('hour').fromNow(): '刚刚'} 
                    state={ command.val == 1?"success":"error" } />
                )
              return <span key={ `command_${command.id ? command.id : Math.random()}` }></span>;
            })
          }
        </Timeline>
      </IceContainer>
    )
  }

}

class BugFeedbacks extends Component {

  render() {
    const { dataSource } = this.props;
    return (
      <IceContainer className="latest-news" style={styles.cardContainer}>
        <h3 style={styles.cardTitle}>
          检修反馈 
          <a className="link" href="#" style={styles.more}>
            更多
          </a>
        </h3>
        <div style={styles.items}>
          {dataSource.comments.map((item, index) => {
            return (
              <a
                className="link"
                key={index}
                href="#"
                style={styles.item}
              >
                <div style={styles.itemComment}>
                  <div style={styles.commentTitle}>{item.title}</div>
                  <div style={styles.commentTime}>{item.time}</div>
                </div>
                <div style={styles.commentNum}>{item.num}</div>
              </a>
            );
          })}
        </div>
      </IceContainer>
    );
  }
}

export { BugFeedbacks, BugNews, OperateRecord }
const styles = {
  cardContainer: {
    height: '300px',
    overflowY: 'auto',
  },
  cardTitle: {
    position: 'relative',
    margin: '0 0 10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  more: {
    position: 'absolute',
    right: 0,
    fontSize: '12px',
    color: '#666',
  },
  item: {
    position: 'relative',
    display: 'block',
  },
  itemTime: {
    position: 'absolute',
    right: 0,
    top: 6,
    fontSize: '12px',
  },
  itemTitle: {
    height: '34px',
    lineHeight: '34px',
    fontSize: '13px',
  },
  itemComment: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
  },
  commentTitle: {
    height: '28px',
    lineHeight: '28px',
    fontSize: '13px',
  },
  commentTime: {
    fontSize: '12px',
  },
  commentNum: {
    position: 'absolute',
    right: 0,
    top: 6,
    width: '24px',
    height: '24px',
    lineHeight: '24px',
    fontSize: '12px',
    textAlign: 'center',
    borderRadius: '50px',
    background: '#FF2851',
    color: '#fff',
  },
};
