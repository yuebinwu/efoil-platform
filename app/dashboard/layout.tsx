// app/dashboard/layout.tsx，layout是dashboard底层布局，主要是左侧导航条，所有用户操作基于dashboard   2026-6-28 調試成功--跳轉--填寫--成功
import Link from 'next/link';
import UserBadge from '@/components/UserBadge'; // 确保路径正确

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 定義導航結構，两级目录，明確指定各項目的連結路徑
  const navItems = [
    { name: '總覽', href: '/dashboard' },
    { 
      name: '採購記錄', 
      sub: [{ name: '訂單與產權管理', href: '/dashboard/orders' }] 
    },
    { 
      name: '維修服務', 
      sub: [
        // 維修申請指向 request 頁面
        { name: '維修申請', href: '/dashboard/repairs/request' }, 
        // 維修查詢打印指向 query 頁面
        { name: '維修查詢打印', href: '/dashboard/repairs/query' }
      ] 
    },
    { 
      name: '法律文件', 
      sub: [
        { name: '維修單', href: '/dashboard/legal/repair-invoices' }, // 需建立對應頁面
        { name: '發票', href: '/dashboard/legal/invoices' },  // 已確認指向您創建的頁面
        { name: '產權證明書', href: '/dashboard/legal/ownership' },
        { name: '轉讓證明書', href: '/dashboard/legal/transfer' }
      ] 
    },
    { 
      name: '技術文件', 
      sub: [{ name: '設備手冊與技術文件', href: '/dashboard/documents' }] 
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* --- 这里直接调用你写好的组件 --- */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <UserBadge />
        </div>

        {/* 導航目錄 */}
        <nav className="space-y-6 flex-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {/* 一級目錄 */}
              {item.href ? (
                <Link href={item.href} className="text-sm font-bold text-gray-800 uppercase tracking-wider hover:text-blue-600 block">
                  {item.name}
                </Link>
              ) : (
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {item.name}
                </div>
              )}
              
              {/* 二級目錄 */}
              {item.sub && (
                <div className="ml-2 space-y-1">
                  {item.sub.map((sub) => (
                    <Link key={sub.name} href={sub.href} className="block py-1 text-sm text-gray-600 hover:text-blue-600">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}