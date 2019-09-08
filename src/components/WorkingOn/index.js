import React, { Component } from 'react';
import { Link } from 'react-router';
import IceContainer from '@icedesign/container';

export default class BasicWorkingOn extends Component {

  render() {
    return (
      <div className="basic-not-found">
        <IceContainer>
          <div style={styles.notfoundContent}>
            <img
              src="https://images.unsplash.com/photo-1514996937319-344454492b37?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=61beb42b2efcc73d2901212c163858e3&auto=format&fit=crop&w=500&q=60"
              style={styles.imgNotfound}
              alt="WorkingOn"
            />
            <div className="prompt">
              <h3 style={styles.title}>Ops, The Coder Is Working On It~</h3>
              <p style={styles.description}>
                Feed The Coders, Or Back <Link to="/">Home Page</Link>
              </p>
            </div>
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  notfoundContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '500px',
  },
  imgNotfound: {
    marginRight: '50px',
  },
  title: {
    color: '#333',
    fontSize: '24px',
    margin: '20px 0',
  },
  description: {
    color: '#666',
    fontSize: '16px',
  },
};
