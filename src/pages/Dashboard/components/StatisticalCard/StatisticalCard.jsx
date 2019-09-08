import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { enquireScreen } from 'enquire-js';
import { Balloon, Icon, Grid } from '@icedesign/base';


const { Row, Col } = Grid;

export default class StatisticalCard extends Component {
  static displayName = 'StatisticalCard';

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
    };
    this.dataset = [
      {
        text: '未响应派单',
        number: '-',
        imgUrl: require('../../../../images/icon_yiwenkongxin.png'),
        desc: '未及时处理的工单数量',
      },
      {
        text: '今日故障数',
        number: '-',
        imgUrl: require('../../../../images/jinggao.png'),
        desc: '今日设备故障数量',
      },
      {
        text: '检修中',
        number: '-',
        imgUrl: require('../../../../images/yuanquyunwei.png'),
        desc: '正在检修中的工单数量',
      },
      {
        text: '设备在线率',
        number: '-',
        imgUrl: require('../../../../images/tubiao-zhuzhuangtu.png'),
        desc: '在线的设备比例',
      },
    ]
  }

  componentDidMount() {
    this.enquireScreenRegister();
  }

  enquireScreenRegister = () => {
    const mediaCondition = 'only screen and (max-width: 720px)';

    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    }, mediaCondition);
  };

  renderItem = () => {
    const itemStyle = this.state.isMobile ? { justifyContent: 'left' } : {};

    const { data } = this.props;
    const dataset = this.dataset;
    dataset[0].number = data.a1;
    dataset[1].number = data.a2;
    dataset[2].number = data.a3;
    dataset[3].number = `${ data.a42}/${ data.a41 }`;

    return dataset.map((data, idx) => {
      return (
        <Col xxs="24" s="12" l="6" key={idx}>
          <div style={{ ...styles.statisticalCardItem, ...itemStyle }}>
            <div style={styles.circleWrap}>
              <img src={data.imgUrl} style={styles.imgStyle} alt="图片" />
            </div>
            <div style={styles.statisticalCardDesc}>
              <div style={styles.statisticalCardText}>
                {data.text}
                <Balloon
                  align="t"
                  alignment="edge"
                  trigger={
                    <span>
                      <Icon type="help" style={styles.helpIcon} size="xs" />
                    </span>
                  }
                  closable={false}
                >
                  {data.desc}
                </Balloon>
              </div>
              <div style={styles.statisticalCardNumber}>{data.number}</div>
            </div>
          </div>
        </Col>
      );
    });
  };

  render() {
    return (
      <IceContainer style={styles.container}>
        <Row wrap>{this.renderItem()}</Row>
      </IceContainer>
    );
  }
}

const styles = {
  container: {
    padding: '10px 20px',
  },
  statisticalCardItem: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
  },
  circleWrap: {
    width: '70px',
    height: '70px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    marginRight: '10px',
  },
  imgStyle: {
    maxWidth: '100%',
  },
  helpIcon: {
    marginLeft: '5px',
    color: '#b8b8b8',
  },
  statisticalCardDesc: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statisticalCardText: {
    position: 'relative',
    color: '#333333',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statisticalCardNumber: {
    color: '#333333',
    fontSize: '24px',
  },
  itemHelp: {
    width: '12px',
    height: '12px',
    position: 'absolute',
    top: '1px',
    right: '-15px',
  },
};
