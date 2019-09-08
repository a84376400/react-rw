import React, { PureComponent } from 'react';
import Layout from '@icedesign/layout';
import cx from 'classnames';
import Logo from './Logo';

export default class Footer extends PureComponent {
  render() {
    const { className, style, ...others } = this.props;
    return (
      <Layout.Footer
        {...others}
        className={cx('ice-design-layout-footer', className)}
        style={{
          ...style,
          lineHeight: '36px',
        }}
      >
        <div className="ice-design-layout-footer-body">
          <div style={{ filter: 'grayscale(100%)', opacity: 0.3 }}>
            <Logo />
          </div>
          <div className="copyright">
            © 2018 版权所有{' '}
            <a
              href="https://github.com/alibaba/ice"
              target="_blank"
              className="copyright-link"
              rel="noopener noreferrer"
            >
             瑞威光电 
            </a>
          </div>
        </div>
      </Layout.Footer>
    );
  }
}
