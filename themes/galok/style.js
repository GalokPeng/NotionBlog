/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      // 底色
      body {
        background-color: #e2e0e2ff;
      }
      .dark body {
        background-color: #000000b6;
      }

      /* galok的首页响应式分栏 */
      #theme-galok .grid-item {
        height: auto;
        break-inside: avoid-column;
        margin-bottom: 0.5rem;
      }

      /* 大屏幕（宽度≥1024px）下显示3列 */
      @media (min-width: 1024px) {
        #theme-galok .grid-container {
          column-count: 3;
          column-gap: 0.5rem;
        }
      }

      /* 小屏幕（宽度≥640px）下显示2列 */
      @media (min-width: 640px) and (max-width: 1023px) {
        #theme-galok .grid-container {
          column-count: 2;
          column-gap: 0.5rem;
        }
      }

      /* 移动端（宽度<640px）下显示1列 */
      @media (max-width: 639px) {
        #theme-galok .grid-container {
          column-count: 1;
          column-gap: 0.5rem;
        }
      }

      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        padding: 10px;
      }
      /* 在全局样式中添加 */
      .glass-effect {
        background: rgba(255, 255, 255, 0.15); /* 白色半透明背景 */
        backdrop-filter: blur(10px); /* 模糊效果 */
        -webkit-backdrop-filter: blur(10px); /* Safari兼容 */
        border: 1px solid rgba(255, 255, 255, 0.2); /* 半透明白色边框 */
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1); /* 柔和阴影增强层次感 */
      }

      /* 深色模式下的液态玻璃效果 */
      .dark .glass-effect {
        background: rgba(17, 25, 40, 0.5); /* 深色半透明背景 */
        border: 1px solid rgba(255, 255, 255, 0.1); /* 深色模式下的边框 */
      }

      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `}</style>
  )
}

export { Style }
