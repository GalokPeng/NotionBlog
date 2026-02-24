import DarkModeButton from '@/components/DarkModeButton'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import CONFIG from '@/themes/galok/config'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
// import Announcement from './Announcement'
// import Catalog from './Catalog'
// import GroupCategory from './GroupCategory'
import GroupTag from './GroupTag'
import Logo from './Logo'
import MailChimpForm from './MailChimpForm'
import { MenuList } from './MenuList'
import SearchInput from './SearchInput'
import SiteInfo from './SiteInfo'
import SocialButton from './SocialButton'

/**
 * 侧边栏
 * @param {*} props
 * @returns
 */
function AsideLeft(props) {
  const {
    tagOptions,
    currentTag,
    categoryOptions,
    currentCategory,
    post,
    slot,
    notice
  } = props
  const router = useRouter()
  const { fullWidth } = useGlobal()

  const GALOK_SIDEBAR_COLLAPSE_SATUS_DEFAULT =
    fullWidth ||
    siteConfig('GALOK_SIDEBAR_COLLAPSE_SATUS_DEFAULT', null, CONFIG)

  const GALOK_SIDEBAR_COLLAPSE_ON_SCROLL = siteConfig(
    'GALOK_SIDEBAR_COLLAPSE_ON_SCROLL',
    false,
    CONFIG
  )

  const GALOK_SIDEBAR_COLLAPSE_BUTTON = siteConfig(
    'GALOK_SIDEBAR_COLLAPSE_BUTTON',
    null,
    CONFIG
  )

  // 侧边栏折叠从 本地存储中获取 open 状态的初始值
  const [isCollapsed, setIsCollapse] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('galok-sidebar-collapse') === 'true' ||
        GALOK_SIDEBAR_COLLAPSE_SATUS_DEFAULT
      )
    }
    return GALOK_SIDEBAR_COLLAPSE_SATUS_DEFAULT
  })

  // 在组件卸载时保存 open 状态到本地存储中
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('galok-sidebar-collapse', isCollapsed)
    }
  }, [isCollapsed])

  const isReverse = siteConfig('LAYOUT_SIDEBAR_REVERSE')
  const position = useMemo(() => {
    if (isCollapsed) {
      if (isReverse) {
        return 'right-2'
      } else {
        return 'left-2'
      }
    } else {
      if (isReverse) {
        return 'right-80'
      } else {
        return 'left-80'
      }
    }
  }, [isCollapsed, isReverse])

  // 折叠侧边栏
  const toggleOpen = () => {
    setIsCollapse(!isCollapsed)
  }

  // 自动折叠侧边栏 onResize 窗口宽度小于1366 || 滚动条滚动至页面的300px时 ; 将open设置为false
  useEffect(() => {
    if (!GALOK_SIDEBAR_COLLAPSE_ON_SCROLL) {
      return
    }
    const handleResize = debounce(() => {
      if (window.innerWidth < 1366 || window.scrollY >= 1366) {
        setIsCollapse(true)
      } else {
        setIsCollapse(false)
      }
    }, 100)

    if (post) {
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize, { passive: true })
    }

    return () => {
      if (post) {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize, { passive: true })
      }
    }
  }, [GALOK_SIDEBAR_COLLAPSE_ON_SCROLL, post])
  // 添加主内容高度和窗口高度监听
  const [mainContentHeight, setMainContentHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0) // 新增窗口高度状态

  useEffect(() => {
    // 只在客户端执行window相关操作
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight)
    }

    const updateMainContentHeight = () => {
      const mainContent = document.getElementById('container-inner')
      if (mainContent) {
        setMainContentHeight(mainContent.offsetHeight)
      }
    }

    // 初始化高度
    updateWindowHeight()
    updateMainContentHeight()

    // 监听窗口大小变化更新高度
    window.addEventListener('resize', updateWindowHeight)
    window.addEventListener('resize', updateMainContentHeight)

    // 监听主内容变化
    const mainContent = document.getElementById('container-inner')
    if (mainContent) {
      const observer = new MutationObserver(() => {
        updateMainContentHeight()
        updateWindowHeight()
      })
      observer.observe(mainContent, { childList: true, subtree: true })

      return () => {
        observer.disconnect()
        window.removeEventListener('resize', updateWindowHeight)
        window.removeEventListener('resize', updateMainContentHeight)
      }
    }
  }, [])
  return (
    <div
      className={`sideLeft relative ${isCollapsed ? 'w-0' : 'w-80'} duration-300 transition-all bg-white dark:bg-hexo-black-gray min-h-screen hidden lg:block z-20`}>
      {/* 悬浮的折叠按钮 */}
      {GALOK_SIDEBAR_COLLAPSE_BUTTON && (
        <div
          className={`${position} hidden lg:block fixed top-0 cursor-pointer hover:scale-110 duration-300 px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-black dark:hover:text-white`} // 补充深色模式hover颜色
          onClick={toggleOpen}>
          {isCollapsed ? (
            <i className='fa-solid fa-indent text-xl'></i>
          ) : (
            <i className='fas fa-bars text-xl'></i>
          )}
        </div>
      )}

      <div
        className={`${isCollapsed ? 'hidden' : 'p-8'} flex flex-col h-full `}
        style={{
          maxHeight: 'calc(100vh - 2rem)', // 预留顶部空间
          minHeight:
            windowHeight > 0 && mainContentHeight < windowHeight
              ? '100vh'
              : 'auto',
          position: 'sticky',
          top: '1rem', // 距离顶部的距离
          width: isCollapsed ? '0' : '20rem' // 固定宽度确保布局稳定
        }}>
        <div className='overflow-y-auto flex-grow scrollbar-hide text-center'>
          <div className='flex items-center justify-center w-full'>
            {/* Logo 左对齐 */}
            <div className='flex flex-none text-center'>
              <Logo {...props} />
            </div>
            {/* <section className='flex flex-1 justify-center dark:text-gray-200'>
              <SocialButton />
            </section> */}
            {/* 主题切换按钮居中 */}
            {/* <section className='flex flex-1 justify-center dark:text-gray-200'>
              <DarkModeButton />
            </section> */}

            {/* 右侧留空（保持和原有布局平衡） */}
            {/* <div className='flex-none w-[40px]'></div> */}
          </div>
          <br />
          <div className='flex items-center justify-between w-full'>
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
          <section className='siteInfo flex flex-col dark:text-gray-300 pt-8'>
            {siteConfig('DESCRIPTION')}
          </section>

          <section className='flex flex-col text-gray-600'>
            <div className='w-12 my-4' />
            <MenuList {...props} />
          </section>

          {/* <section className='flex flex-col text-gray-600'>
          <div className='w-12 my-4' />
          <SearchInput {...props} />
        </section> */}

          {/* <section className='flex flex-col dark:text-gray-300'>
          <div className='w-12 my-4' />
          <Announcement post={notice} />
        </section> */}

          <section>
            <MailChimpForm />
          </section>
          {/* <section className='flex flex-col text-gray-600'>
            <div className='w-12 my-4' />
            <SearchInput {...props} />
          </section> */}
          <section>
            <AdSlot type='in-article' />
          </section>

          {router.asPath !== '/tag' && (
            <section className='flex flex-col'>
              <div className='w-12 my-4' />
              <GroupTag tags={tagOptions} currentTag={currentTag} />
            </section>
          )}

          {/* {router.asPath !== '/category' && (
          <section className='flex flex-col'>
            <div className='w-12 my-4' />
            <GroupCategory
              categories={categoryOptions}
              currentCategory={currentCategory}
            />
          </section>
        )} */}

          {/* <section className='sticky top-0 pt-12  flex flex-col max-h-screen '>
          <Catalog toc={post?.toc} />
          <div className='flex justify-center'>
            <div>{slot}</div>
          </div>
        </section> */}
        </div>
        {/* 固定在底部的 SiteInfo */}
        <section className='mt-auto pt-6 border-t dark:border-gray-700'>
          <div className='w-12 my-4' />
          <SiteInfo />
        </section>
      </div>
    </div>
  )
}

export default AsideLeft
