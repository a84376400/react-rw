import React, { Component } from 'react';

import StatisticalCard from './components/StatisticalCard';

import DataStatistics from './components/DataStatistics';

import RealTimeStatistics from './components/RealTimeStatistics';

import LatestNews from './components/LatestNews';

import './Dashboard.scss';

import { Func } from 'fpmc-jssdk';

export default class Dashboard extends Component {
  static displayName = 'Dashboard';

  constructor(props) {
    super(props);
    this.state = {
      a: { a1: '-', a2: '-', a3: '-', a41: '-', a42: '-'},
      b: {},
      c: { c1: '-', c22: '-', c21: '-', c3: '-', c4: '-'},
    };
  }

  componentDidMount(){
    new Func('statistics.dashboard')
      .invoke()
      .then(data => {
        this.setState(data);
      })
  }
  render() {
    return (
      <div className="dashboard-page">
        <StatisticalCard data={ this.state.a }/>

        <DataStatistics />

        <RealTimeStatistics data = { this.state.c }/>

        <LatestNews />
      </div>
    );
  }
}
