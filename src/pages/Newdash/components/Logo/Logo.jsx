import React from 'react';
import styles from './index.module.scss';

export default function Logo() {
  const logo = require('./images/logo1.png');
  return (
    <div  className={styles.logo}>
      <img src={logo} width="80" height="80" alt="logo" />
      <span className={styles.text}>江苏省扬州市公安局</span>
      <span className={styles.textcenter}>视频监控智慧运维系统可视化平台</span>
    </div>
  );
}
