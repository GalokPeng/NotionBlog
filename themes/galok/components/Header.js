import Collapse from '@/components/Collapse'
import { useRef, useState } from 'react'
import Logo from './Logo'
import { MenuList } from './MenuList'
import DarkModeButton from '@/components/DarkModeButton'
// import SearchInput from './SearchInput'
import SocialButton from './SocialButton'

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const [isOpen, changeShow] = useState(false) // 默认展开菜单
  const collapseRef = useRef(null)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  return (
    <div id='top-nav' className='z-40 block lg:hidden'>
      {/* 导航栏 - 固定在顶部 */}
      <div
        id='sticky-nav'
        className={
          'fixed top-0 w-full z-50 bg-white dark:bg-black shadow-md glass-effect'
        }>
        <Collapse type='vertical' isOpen={isOpen} collapseRef={collapseRef}>
          <div className='py-1 px-5 justify-center'>
            <MenuList
              {...props}
              onHeightChange={param =>
                collapseRef.current?.updateCollapseHeight(param)
              }
            />
            {/* <SearchInput {...props} /> */}
          </div>
        </Collapse>
        <div className='w-full flex justify-between items-center p-4 '>
          {/* 左侧LOGO 标题 */}
          <div className='flex items-center justify-between w-full'>
            {/* Logo 左对齐 */}
            <div className='flex flex-none'>
              <Logo {...props} />
            </div>
            <section className='flex flex-1 justify-center dark:text-gray-200'>
              <SocialButton />
            </section>
            {/* 主题切换按钮居中 */}
            <section className='flex flex-1 justify-center dark:text-gray-200'>
              <DarkModeButton />
            </section>

            {/* 右侧留空（保持和原有布局平衡） */}
            {/* <div className='flex-none w-[40px]'></div> */}
          </div>
          <div className='flex'></div>

          {/* 右侧功能 - 保留菜单按钮用于折叠/展开 */}
          <div className='mr-1 flex justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
            <div
              onClick={toggleMenuOpen}
              className='cursor-pointer text-lg p-2'>
              {isOpen ? (
                <i className='fas fa-times' />
              ) : (
                <i className='fas fa-bars' />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
