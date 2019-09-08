import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Feedback, Button, Icon, Input, Field, Form } from "@icedesign/base";
import { CustomTable, SearchBar, TableToolbar } from '../../components';

import CustomBreadcrumb from '../../components/CustomBreadcrumb';

import { Table } from '@icedesign/base';
import { Dialog } from '@icedesign/base';

import IceContainer from '@icedesign/container';
import fpmc from 'fpmc-jssdk';
const FormItem = Form.Item;
const Toast = Feedback.toast;

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            style: {
                width: "40%"
            },
            edVisible: false,
        };
        this.field = new Field(this);
    };

    // state = {
    //     visible: false
    //   };

    //添加编辑按钮
    renderCell = (value, index, record) => {
        return <Button type="primary" size="small" onClick={this.onEdit.bind(this, record.id)}><span>编辑</span></Button>;
    };
    //编辑按钮事件
    onEdit = (id) => {
        //Toast.success('编辑值' + id);
        this.setState({
            edVisible:true
        });
    };

    onOpen = () => {
        this.setState({
            visible: true
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            edVisible:false,
        });
    };

    render() {
        const breadcrumb = [
            { text: '通用设置', link: '' },
            { text: '指令管理', link: '#/setting/order' },
        ];

        //设置列表模拟数据
        const dataSource = [{ id: 1, code: 'C001', codeTitle: '主板温度预警', codeRank: '警报', codeWarningMes: ' 主板温度过高', codeReturnMes: '主板温度恢复正常' },
        { id: 2, code: 'C002', codeTitle: '主板温度保送', codeRank: '信息', codeWarningMes: ' 当前主板温度正常，温度为30度', codeReturnMes: '当前主板温度正常，温度为30度', }];
        const init = this.field.init;
        return (
            <div className="tab-table">
                <CustomBreadcrumb dataSource={breadcrumb} />
                <IceContainer>
                    <TableToolbar>
                        <Button type="primary" size="small" onClick={this.onOpen}>
                            <span>添加</span>
                        </Button>
                        <Dialog
                            visible={this.state.visible}
                            style={this.state.style}
                            onOk={this.onClose}
                            closable="esc,mask,close"
                            onCancel={this.onClose}
                            onClose={this.onClose}
                            title="新建指令">
                            <div className="settings-form">
                                <IceContainer>
                                    <Form direction="ver" field={this.field} >
                                        <FormItem label="指令编码：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('code', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令标题：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeTitle', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令等级：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeRank', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令警报信息：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeWarningMes', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令恢复信息：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeReturnMes', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                    </Form>
                                </IceContainer>
                            </div>

                        </Dialog>
                    </TableToolbar>

                    <Table hasBorder={false} dataSource={dataSource} >
                        <Table.Column width={80} title="序号" dataIndex="id" />
                        <Table.Column width={120} title="指令编码" dataIndex="code" />
                        <Table.Column width={150} title="指令标题" dataIndex="codeTitle" />
                        <Table.Column width={100} title="指令等级" dataIndex="codeRank" />
                        <Table.Column width={225} title="指令警报信息" dataIndex="codeWarningMes" />
                        <Table.Column width={225} title="指令恢复信息" dataIndex="codeReturnMes" />
                        <Table.Column cell={this.renderCell} width={100} title="操作" />
                    </Table>
                    <Dialog
                    visible={this.state.edVisible}
                    style={this.state.style}
                    closable="esc,mask,close"
                    onCancel={this.onClose}
                    onClose={this.onClose}
                    title="编辑指令"
                    >
                    <div className="settings-form">
                                <IceContainer>
                                    <Form direction="ver" field={this.field} >
                                        <FormItem label="指令编码：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('code', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令标题：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeTitle', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令等级：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeRank', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令警报信息：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeWarningMes', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                        <FormItem label="指令恢复信息：" {...styles.formItemLayout}>
                                            <Input
                                                {...init('codeReturnMes', {
                                                    rules: [{ required: true, message: '必填选项' }],
                                                })}
                                            />
                                        </FormItem>
                                    </Form>
                                </IceContainer>
                            </div>

                    </Dialog>

                </IceContainer>
            </div>
        )
    };
};
const styles = {
    formItemLayout: {
        labelCol: {
            fixedSpan: 6,
        },
        wrapperCol: {
            span: 14,
        },
    }
};

export default OrderList
