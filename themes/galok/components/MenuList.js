// galok/components/MenuList.js

import { MenuItemNormal } from './MenuItemNormal' // 改用普通菜单项组件

export const MenuList = props => {
  // 固定显示的菜单项，移除动态配置
  const links = [
    { name: '主页', href: '/', show: true, icon: 'fa-home' }, // 首页图标
    { name: '归档', href: '/archive', show: true, icon: 'fa-archive' }, // 归档图标
    { name: '标签', href: '/tag', show: true, icon: 'fa-tags' }, // 标签图标
    { name: '关于', href: '/about', show: true, icon: 'fa-user' } // 个人图标
    // { name: 'RSS', href: '/rss/feed.xml', show: true, icon: 'fa-rss' } // RSS图标
  ]

  if (!links || links.length === 0) {
    return null
  }

  return (
    <>
      <menu id='nav-pc' className='hidden md:block text-sm z-10'>
        {links?.map((link, index) => (
          <MenuItemNormal key={index} link={link} /> // 使用非折叠组件
        ))}
      </menu>
      <menu id='nav-mobile' className='block md:hidden text-sm z-10 pb-1'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {' '}
          {/* 移动端使用紧凑的网格布局 */}
          {links?.map((link, index) => (
            <MenuItemNormal key={index} link={link} />
          ))}
        </div>
      </menu>
    </>
  )
}
