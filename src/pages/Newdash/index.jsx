import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import SysRunData from './components/SysRunData';
import FaultInfo from './components/FaultInfo';
import RiskInfo from './components/RiskInfo';
import TypeChart from './components/TypeChart';
import AreaChart from './components/AreaChart';
import WeekChart from './components/WeekChart';
import OnlineChart from './components/OnlineChart';
import RepairChart from './components/RepairChart';
import Header from './components/Header';
import Footer from './components/Footer';
import styles from './index.module.scss';

const { Row, Col } = Grid;

export default function Newdash() {
  return (
    <div className={styles.blankLayout}>
      <div className={styles.blankLayoutContent}>
        <Header />
        <div >
        {/* 基础数据概览 */}
        <Row gutter="10">
          <Col xxs={19}>
            <Row gutter="10">
              <Col xxs={24}>
                <SysRunData />
              </Col>
            </Row>
            <Row gutter="10">
              <Col xxs={6}>
                <TypeChart />
              </Col>
              <Col xxs={6}>
                <AreaChart />
              </Col>
              <Col xxs={12}>
                <WeekChart />
              </Col>
            </Row>
            <Row gutter="10">
              <Col xxs={12}>
                <OnlineChart />
              </Col>
              <Col xxs={12}>
                <RepairChart />
              </Col>
            </Row>
          </Col>
          <Col xxs={5}>
            <Row gutter="10">
              <Col xxs={24}>
                <FaultInfo />
              </Col>
            </Row>
            <Row gutter="10">
              <Col xxs={24}>
                <RiskInfo />
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
        <Footer />
      </div>
    </div>

    
  );
}

