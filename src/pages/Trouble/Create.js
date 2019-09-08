import React,{ Component } from 'react'
import IceContainer from '@icedesign/container';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import fpmc, { Func } from 'fpmc-jssdk';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Range,
  Balloon,
  DatePicker,
  TimePicker,
  NumberPicker,
  Field,
  Switch,
  Upload,
  Grid,
  Feedback
} from "@icedesign/base";

const { RangePicker } = DatePicker;
const { Row, Col } = Grid;
const { Option } = Select;

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Toast = Feedback.toast;


export default class extends Component{

    constructor(props) {
        super(props);
    }

    componentDidMount(){

    }
    field = new Field(this);

    handleSubmit(e) {
        e.preventDefault();
        console.log("收到表单值：", this.field.getValues());
        this.field.validate();
    }

    getValueFromFile(e) {
        if (Array.isArray(e)) {
        return e;
        }
        return e && e.fileList;
    }
    

    render() {
        const breadcrumb = [
            { text: '故障处理', link: '' },
            { text: '检修派单', link: '' },
        ];
        const init = this.field.init;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        return (
            <div className="cate-list-page">
                <CustomBreadcrumb dataSource={breadcrumb} />
                <IceContainer>
                    <Form field={this.field}>
                        <FormItem label="故障标题：" {...formItemLayout}>
                        <Input />
                        </FormItem>
                        <FormItem label="我是标题：" {...formItemLayout}>
                        <p className="next-form-text-align">唧唧复唧唧木兰当户织呀</p>

                        <p className="next-form-text-align">
                            <a href="#">链接文字</a>
                        </p>
                        </FormItem>

                        <FormItem label="NumberPicker 数字输入框：" {...formItemLayout}>
                        <NumberPicker
                            min={1}
                            max={10}
                            {...init("numberPicker", { initValue: 3 })}
                        />
                        <span> 台机器</span>
                        </FormItem>

                        <FormItem label="Switch 开关：" {...formItemLayout} required>
                        <Switch
                            {...init("switch", { valueName: "checked", initValue: true })}
                        />
                        </FormItem>

                        <FormItem label="Range 滑动输入条：" {...formItemLayout} required>
                        <Range
                            defaultValue={30}
                            scales={[0, 100]}
                            style={{ marginTop: "10px" }}
                            marks={[0, 100]}
                            {...init("range")}
                        />
                        </FormItem>

                        <FormItem label="Select 选择器：" {...formItemLayout} required>
                        <Select style={{ width: 200 }} {...init("select")}>
                            <Option value="jack">jack</Option>
                            <Option value="lucy">lucy</Option>
                            <Option value="disabled" disabled>
                            disabled
                            </Option>
                            <Option value="hugohua">hugohua</Option>
                        </Select>
                        </FormItem>

                        <FormItem
                        label="DatePicker 日期选择框："
                        labelCol={{ span: 6 }}
                        required
                        >
                        <Row>
                            <FormItem style={{ marginRight: 10 }}>
                            <DatePicker {...init("startDate")} />
                            </FormItem>
                            <FormItem>
                            <DatePicker {...init("endDate")} />
                            </FormItem>
                        </Row>
                        </FormItem>

                        <FormItem
                        label="RangePicker 范围选择框："
                        labelCol={{ span: 6 }}
                        required
                        >
                        <RangePicker {...init("rangeDate")} />
                        </FormItem>

                        <FormItem label="TimePicker 时间选择器：" {...formItemLayout} required>
                        <TimePicker
                            {...init("time", {
                            getValueFromEvent: time => {
                                time =
                                time &&
                                time.toLocaleTimeString("zh-CN", {
                                    hour12: false
                                });

                                return time;
                            }
                            })}
                        />
                        </FormItem>

                        <FormItem
                        className="next-form-text-align"
                        label="Checkbox 多选框："
                        {...formItemLayout}
                        >
                        <Checkbox {...init("checkbox1")}>选项一 </Checkbox>
                        <Checkbox {...init("checkbox2")}>选项二 </Checkbox>
                        <Checkbox disabled {...init("checkbox3")}>
                            选项三（不可选）
                        </Checkbox>
                        </FormItem>
                        <Row style={{ marginTop: 24 }}>
                        <Col offset="6">
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                            创建
                            </Button>
                        </Col>
                        </Row>
                    </Form>
                </IceContainer>
            </div>
        );
    }
}