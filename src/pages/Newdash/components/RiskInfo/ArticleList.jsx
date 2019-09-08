import React from 'react';
import IceContainer from '@icedesign/container';
import { Pagination, Button } from '@alifd/next';
import './LatestNews.scss';
import styles1 from './index.module.scss';

export default function ArticleList(props) {
  const { isMobile, dataSource = [] } = props;

  const handleTagClick = () => {
    // handler
  };

  const renderTag = (text, onClick) => {
    return (
      <Button size="small" onClick={onClick} key={text} style={styles.button}>
        {text}
      </Button>
    );
  };

  const renderItem = (data, idx) => {
    const wrapperStyle = { ...styles.item };
    const informationStyle = { ...styles.information };
    return (
      <div key={idx} style={wrapperStyle}>
        <div style={styles.title}>
          {data.title}
          {!isMobile && <span style={styles.datetime}>{data.datetime}</span>}
        </div>
        <div style={styles.desc}>{data.description}
          <div style={informationStyle}>
            <div style={styles.tagList}>
              {data.tags.map((item) => {
                return renderTag(
                  item,
                  handleTagClick(idx, item),
                  idx
                );
              })}
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <IceContainer className={styles1.cardContainer}>
      <h3 className={styles1.cardTitle}>
        风险提示 :
          <a href="./#/newdash" className={`${styles1.more} link`}>
          更多
          </a>
      </h3>
      {dataSource.map(renderItem)}

    </IceContainer>
  );
}

const styles = {
  item: {
    borderBottom: '1px solid #F4F4F4',
    marginBottom: '1px',
  },
  title: {
    color: '#bfbfbf',
    fontSize: '14px',
    marginBottom: '1px',
    position: 'relative',
  },
  datetime: {
    position: 'absolute',
    right: '10px',
    fontSize: '12px',
    color: '#9B9B9B',
  },
  desc: {
    color: '#bfbfbf',
    fontSize: '11px',
    lineHeight: '20px',
    paddingBottom: '1px',
  },
  information: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1px',
  },
  button: {
    marginRight: '1px',
  },
  operator: {
    paddingTop: '1px',
    fontSize: '12px',
    color: '#9B9B9B',
  },
  operatorItem: {
    marginRight: '1px',
  },
  paginationWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '1px',
  },
  cardContainer: {
    height: '418px !important',
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
    right: '0',
    fontSizee: '12px',
    color: '#666',
  }
};