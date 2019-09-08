import React, { Component } from 'react';
import Iframe from 'react-iframe';
import IceContainer from '@icedesign/container';

export default class MonitorMap extends Component {
  static displayName = 'MonitorMap';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <IceContainer>
          <Iframe url="http://localhost:8088/protal/index.html"
            id="monitormap"
            className="monitorMap"
            display="initial"
            position="fixed"
            allowFullScreen
          />
        </IceContainer>
      </div>
    );
  }
}
