import React, { useState, useEffect } from 'react';
import IceContainer from '@icedesign/container';
import { enquireScreen } from 'enquire-js';
import ArticleList from './ArticleList';
import styles from  './index.module.scss'

const dataSource = [
  {
    title: '电压大于上限',
    description:
      '设备：测试机柜25 ',
    tags: ['警告'],
    datetime: '2017年12月12日 18:00',
  },
  {
    title: '电压大于上限',
    description:
      '设备：测试机柜25 ',
    tags: ['警告'],
    datetime: '2017年12月12日 18:00',
  },
  {
    title: '电压大于上限',
    description:
      '设备：测试机柜25 ',
    tags: ['警告'],
    datetime: '2017年12月12日 18:00',
  },
];

export default function Index() {
  const [isMobile, setMobile] = useState(false);
  
  useEffect(() => {
    enquireScreenRegister();
  }, []);

  const enquireScreenRegister = () => {
    const mediaCondition = 'only screen and (max-width: 720px)';

    enquireScreen((mobile) => {
      setMobile(mobile);
    }, mediaCondition);
  };

  return (
    <div className="latest-news">
      <ArticleList isMobile={isMobile} dataSource={dataSource} />
    </div>
  );
}

