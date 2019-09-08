// <!-- auto generated navs start -->
const autoGenHeaderNavs = [];
const autoGenAsideNavs = [];
// <!-- auto generated navs end -->

const customHeaderNavs = [
  // {
  //   text: '告警',
  //   // to: '/trouble',
  //   balloon: true,
  //   external: false,
  //   newWindow: false,
  //   icon: 'bangzhu',
  // }
];

const customAsideNavs = [
  {
    text: '仪表板',
    to: '/',
    icon: 'home',
  },
  {
    text: '仪表板2',
    to: '/newdash',
    icon: 'home',
  },
  {
    text: '故障处理',
    to: '/trouble',
    icon: 'pin',
    children: [
      { text: '故障清单', to: '/trouble/list' },
      { text: '告警清单', to: '/trouble/alarm' },
    ],
  },
  {
    text: '设备管理',
    to: '/devices',
    icon: 'cascades',
    children: [
      { text: '设备列表', to: '/devices/list' },
      { text: '参数设置', to: '/devices/setting' }
    ],
  },
  {
    text: '工单管理',
    to: '/worksheet',
    icon: 'yonghu',
    children: [
      { text: '工单列表', to: '/worksheet/list' },
      { text: '创建工单', to: '/worksheet/create' },
    ],
  },
  {
    text: '数据统计',
    to: '/workingon',
    icon: 'copy',
    children: [
      { text: '报表统计', to: '/workingon/stadatas' },
      //{ text: '历史记录', to: '/workingon' },
    ],
  },
  {
    text: '运维管理',
    to:'/operation',
    icon:'fans',
    children: [
      { text: '运维单位', to: '/operation/company' },
      { text: '考勤签到', to: '/operation/signin' },
      { text: '运检人员', to: '/operation/employee' },
    ],
  },
  {
    text: '通用设置',
    to: '/setting',
    icon: 'shezhi',
    children: [
      { text: '用户管理', to: '/user/list' },
      { text: '区域设置', to: '/setting/area' },
      // { text: '基础设置', to: '/setting/basic' },
      // { text: '菜单设置', to: '/setting/navigation'},
      //{ text: '指令管理', to: '/setting/order'},
    ],
  },
];

function transform(navs) {
  // custom logical
  return [...navs];
}

export const headerNavs = transform([
  ...autoGenHeaderNavs,
  ...customHeaderNavs,
]);

export const asideNavs = transform([...autoGenAsideNavs, ...customAsideNavs]);
