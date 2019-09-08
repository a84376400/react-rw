import React, { PureComponent } from 'react';
import { Link } from 'react-router';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" id="logo">
        <Link to="/" className="logo-text">
        </Link>
      </div>
    );
  }
}
