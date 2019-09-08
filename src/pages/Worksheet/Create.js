import React, {
  Component
} from 'react';
import { Button, Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import './Create.css'
import CreateForm from './components/CreateForm'
const Toast = Feedback.toast;

export default class extends Component {

  constructor(props) {
    super(props);
  }

  createWorksheet = ()=>{
    const { handleSubmit } = this.refs.worksheetForm;
    handleSubmit();
  }

  createOk = (value) => {
    Toast.success('派单成功');

  }

  reset = () => {
    const { reset } = this.refs.worksheetForm;
    reset();
  }
  render() {
    const breadcrumb = [{
        text: '工单管理',
        link: ''
      },
      {
        text: '创建工单',
        link: '#/worksheet/create'
      },
    ];
    return ( 
      <div className = "create-page" >
        <CustomBreadcrumb dataSource = { breadcrumb }/> 
        <IceContainer >
          <div style={{
            marginLeft:'auto',
            marginRight: 'auto',
            maxWidth: '800px',
            // textAlign: 'center'
          }}>
              <CreateForm ref="worksheetForm" createOk = { this.createOk }/>
              <Button type='primary' onClick={ this.createWorksheet }>创建</Button>
              &nbsp;&nbsp;
              <Button onClick={ this.reset }>重置</Button>
            </div>
        </IceContainer>
      </div>
    )
  }
}
