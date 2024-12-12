export const matchMenu = (menu: string) => {
  switch (menu) {
    case 'list':
      return '资源列表'
    case 'configs':
      return '配置管理'
    case 'paths':
      return '路径管理'
  }
}
