// galok/components/MobileFooter.js
import SiteInfo from './SiteInfo'
import SocialButton from './SocialButton'
import DarkModeButton from '@/components/DarkModeButton'
import { useState } from 'react'

const MobileFooter = () => {
  const [isOpen, setIsOpen] = useState(true) // 控制显示/隐藏状态

  return (
    <footer className='lg:hidden bg-white dark:bg-black border-t dark:border-gray-700 fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 glass-effect'>
      {/* 控制按钮 */}
      <div
        className='flex justify-center p-0 cursor-pointer bg-gray-100 dark:bg-gray-800 glass-effect'
        onClick={() => setIsOpen(!isOpen)}>
        <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
      </div>

      {/* 内容区域 - 根据状态显示/隐藏 */}
      <div
        className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-15 py-2 px-4' : 'max-h-0 py-0 px-4'}`}>
        <div className='max-w-md mx-auto'>
          {/* 社交按钮 */}
          {/* <div className='mb-4'>
            <SocialButton />
          </div> */}

          {/* 深色模式切换 */}
          {/* <div className='flex justify-center mb-4'>
            <DarkModeButton />
          </div> */}

          {/* 站点信息 */}
          <div className='text-center'>
            <SiteInfo />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MobileFooter
