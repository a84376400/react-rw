import React from 'react';
import { Nav } from '@alifd/next';
import Logo from '../Logo';
import styles from './index.module.scss';

export default () => {
  
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Logo isDark />
        <div className={styles.headerNavbar}>
          <Nav
            className={styles.headerNavbarMenu}
            direction="hoz"
          >
          </Nav>
        </div>
      </div>
    </div>
  );
}