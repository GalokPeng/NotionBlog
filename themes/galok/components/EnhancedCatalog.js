import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

/**
 * 增强版目录导航组件
 * @param toc 目录数据
 * @param isMobile 是否为移动端
 * @returns {JSX.Element}
 * @constructor
 */
const EnhancedCatalog = ({ toc, isMobile = false }) => {
  const { locale } = useGlobal()
  const [activeSection, setActiveSection] = useState(null)
  const [collapsed, setCollapsed] = useState(isMobile)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showExplosion, setShowExplosion] = useState(false)
  const tRef = useRef(null)
  const progressRef = useRef(null)

  // 切换目录展开/收起状态
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  // 监听滚动事件，更新当前阅读位置和进度
  useEffect(() => {
    const throttleMs = 200
    const actionSectionScrollSpy = throttle(() => {
      // 计算阅读进度（基于文章内容容器）
      const articleWrapper = document.getElementById('article-wrapper')
      let currentProgress = 0

      if (articleWrapper) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const articleRect = articleWrapper.getBoundingClientRect()
        const articleTop = articleRect.top + scrollTop // 文章内容顶部的绝对位置
        const articleHeight = articleRect.height // 文章内容总高度
        const viewportHeight = window.innerHeight // 视口高度

        // 计算当前滚动位置相对于文章内容的位置
        const relativeScroll = scrollTop - articleTop

        // 进度计算逻辑：
        // - 未滚动到文章区域时进度为0
        // - 滚动超过文章底部时进度为100
        // - 中间区域按相对位置计算
        if (relativeScroll <= 0) {
          currentProgress = 0
        } else if (relativeScroll + viewportHeight >= articleHeight) {
          currentProgress = 100
        } else {
          currentProgress = Math.min(
            Math.round((relativeScroll / articleHeight) * 100),
            100
          )
        }
      }

      setReadingProgress(currentProgress)

      // 当阅读进度达到100%时，显示爆炸动画
      if (currentProgress === 100 && readingProgress < 100) {
        setShowExplosion(true)
        setTimeout(() => {
          setShowExplosion(false)
        }, 1500)
      }

      // 更新当前阅读的章节
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = activeSection
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        // GetBoundingClientRect returns values relative to viewport
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        // No need to continue loop, if last element has been detected
        break
      }
      setActiveSection(currentSectionId)
      const index = toc?.findIndex(obj => uuidToId(obj.id) === currentSectionId)
      tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
    }, throttleMs)

    actionSectionScrollSpy()
    window.addEventListener('scroll', actionSectionScrollSpy)
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [toc, activeSection, readingProgress])

  // 无目录就直接返回空
  if (!toc || toc?.length < 1) {
    return <></>
  }

  // 爆炸动画效果
  const ExplosionEffect = () => {
    return (
      <div
        className={`absolute top-0 right-0 w-6 h-6 ${showExplosion ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div className='relative w-full h-full'>
          <div className='absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-75'></div>
          <div className='absolute inset-1 animate-ping rounded-full bg-red-500 opacity-75 delay-75'></div>
          <div className='absolute inset-2 animate-ping rounded-full bg-orange-500 opacity-75 delay-150'></div>
        </div>
      </div>
    )
  }
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256) // 0-255
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`
  }
  // 移动端目录
  if (isMobile) {
    return (
      <div
        className={`fixed top-20 left-0 right-0 z-30 bg-white dark:bg-gray-900 shadow-md transition-all duration-300 glass-effect ${collapsed ? 'h-10' : 'max-h-[50vh]'}`}>
        <div
          className='flex items-center justify-between px-4 py-2 cursor-pointer border-b dark:border-gray-700'
          onClick={toggleCollapse}>
          <div className='flex items-center'>
            <i className='mr-2 fas fa-list-ul' />
            <span style={{ color: getRandomColor() }}>
              {locale.COMMON.TABLE_OF_CONTENTS}
            </span>
          </div>
          <div className='flex items-center'>
            <div className='mr-2 text-sm' style={{ color: getRandomColor() }}>
              {readingProgress}%
            </div>
            <i
              className={`fas ${collapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}
            />
            <ExplosionEffect />
          </div>
        </div>

        {!collapsed && (
          <div className='overflow-y-auto scrollbar-hide max-h-[calc(50vh-40px)]'>
            <nav ref={tRef} className='p-4'>
              {toc.map(tocItem => {
                const id = uuidToId(tocItem.id)
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`${activeSection === id ? 'border-gray-800 text-gray-800 dark:border-white dark:text-white font-bold' : ''} 
                      hover:font-semibold border-l pl-4 block hover:text-gray-800 border-l duration-300 transform dark:text-gray-400 dark:border-gray-400
                      notion-table-of-contents-item-indent-level-${tocItem.indentLevel} catalog-item py-1`}
                    onClick={() => setCollapsed(true)}>
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: tocItem.indentLevel * 16
                      }}
                      className={`truncate ${activeSection === id ? 'font-bold text-black dark:text-white underline' : ''}`}>
                      {tocItem.text}
                    </span>
                  </a>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    )
  }

  // 桌面端目录
  return (
    <div
      className={`fixed top-24 right-4 z-20 transition-all duration-300 glass-effect ${collapsed ? 'w-10' : 'w-64'} bg-white dark:bg-gray-800 rounded-lg shadow-lg`}>
      <div className='relative'>
        {/* 进度条 */}
        <div className='absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-t-lg overflow-hidden'>
          <div
            ref={progressRef}
            className='h-full bg-green-500 transition-all duration-300'
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* 目录头部 */}
        <div
          className='flex items-center justify-between px-4 pt-3 pb-2 cursor-pointer'
          onClick={toggleCollapse}>
          {!collapsed && (
            <div className='flex items-center'>
              <i className='mr-2 fas fa-list-ul' />
              <span
                className='dark:text-gray-300'
                style={{ color: getRandomColor() }}>
                {locale.COMMON.TABLE_OF_CONTENTS}
              </span>
            </div>
          )}
          <div className='flex items-center ml-auto'>
            {!collapsed && (
              <div
                className='mr-2 text-sm dark:text-gray-300'
                style={{ color: getRandomColor() }}>
                {readingProgress}%
              </div>
            )}
            <i
              className={`fas ${collapsed ? 'fa-indent' : 'fa-outdent'} dark:text-gray-300`}
            />
            <ExplosionEffect />
          </div>
        </div>

        {/* 目录内容 */}
        {!collapsed && (
          <div
            id='catalog'
            className='flex-1 flex-col flex overflow-hidden px-4 pb-4'>
            <nav
              ref={tRef}
              className='flex-1 overflow-auto overscroll-none scroll-hidden text-black max-h-[calc(100vh-200px)]'>
              {toc.map(tocItem => {
                const id = uuidToId(tocItem.id)
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`${activeSection === id ? 'border-gray-800 text-gray-800 dark:border-white dark:text-white font-bold' : ''} 
                      hover:font-semibold border-l pl-4 block hover:text-gray-800 border-l duration-300 transform dark:text-gray-400 dark:border-gray-400
                      notion-table-of-contents-item-indent-level-${tocItem.indentLevel} catalog-item py-1`}>
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: tocItem.indentLevel * 16
                      }}
                      className={`truncate ${activeSection === id ? 'font-bold text-black dark:text-white underline' : ''}`}>
                      {tocItem.text}
                    </span>
                  </a>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedCatalog
