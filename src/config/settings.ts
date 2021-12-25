const defaultSetting = {
  title: '后台管理系统',
  /**
   * @type {boolean} true | false
   * @description 侧边栏 title
  */
  fixedHeader: false,
  /**
   * @type {boolean} true | false
   * @description 是否显示侧边栏logo
  */
  sideBarLogo: true,
  /**
   * @type {boolean} true | false
   * @description 是否显示设置中心
  */
  showSettings: true,

  /**
   * @type {Array} 
   * @description 不能删除的路由白名单
  */
  affixRouter: ['home']
};

export default defaultSetting;
