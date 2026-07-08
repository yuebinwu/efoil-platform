//2026-6-28 建立一個基礎容器，確保所有正式文件都維持一致的邊界與紙張表現：
// components/templates/DocumentBase.tsx

/**
 * DocumentBase - 正式文档基础布局容器
 * 
 * 功能：
 * 1. 模拟 A4 纸张尺寸 (210mm x 297mm)
 * 2. 统一页眉（公司信息+标题+日期）和页脚（免责声明）
 * 3. 优化打印样式，确保屏幕预览与打印输出一致
 */

export default function DocumentBase({ children, title }: { children: React.ReactNode; title: string }) {
  return (
      // &zwnj;**主容器**&zwnj;
    // max-w-[210mm]: 限制最大宽度为 A4 纸宽
    // mx-auto: 水平居中显示
    // p-[20mm]: 屏幕预览时的内边距，模拟页边距
    // bg-white: 白色背景，模拟纸张
    // min-h-[297mm]: 最小高度为 A4 纸高，确保单页完整
    // font-serif: 使用衬线字体，增强正式感
    // print:p-0: &zwnj;**关键打印优化**&zwnj;，打印时移除容器内边距，依赖浏览器或 @page 规则控制边距，避免双重边距
    <div className="max-w-[210mm] mx-auto p-[20mm] bg-white min-h-[297mm] text-black font-serif print:p-0">
      {/* &zwnj;**页眉区域**&zwnj; */}
      {/* flex justify-between: 左右分布布局 */}
      {/* border-b-2 border-black: 底部粗黑线，分隔页眉与正文 */}
      {/* pb-4 mb-8: 底部内边距和下外边距，增加呼吸感 */}  
      <header className="flex justify-between border-b-2 border-black pb-4 mb-8">
        {/* 左侧：公司信息 */}
        <div>
          <h1 className="text-2xl font-bold">E-FOIL INC.</h1>
          <p className="text-sm">123 Silicon Valley Blvd, CA 94025</p>
        </div>
        {/* 右侧：文档标题与日期 */}
        <div className="text-right">
          {/* uppercase: 标题大写，增强庄重感 */}
          <h2 className="text-xl font-bold uppercase">{title}</h2>
          {/* 动态生成当前日期 */}
          <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </header>
      {/* &zwnj;**正文区域**&zwnj; */}
      {/* 渲染传入的子组件（如 OwnershipTemplate 的具体内容） */}
      <main>{children}</main>

      {/* &zwnj;**页脚区域**&zwnj; */}
      {/* fixed: 固定定位，确保始终位于视口/页面底部 */}
      {/* bottom-[20mm]: 距离底部 20mm，与容器 padding 对应 */}
      {/* w-[170mm]: 宽度 = 总宽(210mm) - 左padding(20mm) - 右padding(20mm) */}
      {/* border-t: 顶部细线，分隔正文与页脚 */}
      {/* text-[10px] text-gray-500: 小号灰色字体，降低视觉干扰 */}
      <footer className="fixed bottom-[20mm] w-[170mm] border-t border-gray-300 pt-4 text-[10px] text-gray-500">
        This document is an official record of E-Foil Inc. Authenticity can be verified via UID.
      </footer>
    </div>
  );
}