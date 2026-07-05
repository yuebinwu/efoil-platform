import Link from 'next/link';
import UserBadge from '@/components/UserBadge'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 导航结构
  const navItems = [
    { name: '總覽', href: '/dashboard' },
    { name: '留言板', href: '/dashboard/messages' },
    { 
      name: '個人設置', // 新增类别
      sub: [{ name: '用户信息', href: '/dashboard/profile' }] 
    },
    { 
      name: '採購記錄', 
      sub: [{ name: '訂單與產權管理', href: '/dashboard/orders' }] 
    },
    { 
      name: '維修服務', 
      sub: [
        { name: '維修申請', href: '/dashboard/repairs/request' }, 
        { name: '維修查詢打印', href: '/dashboard/repairs/query' }
      ] 
    },
    { 
      name: '法律文件', 
      sub: [
        { name: '維修單', href: '/dashboard/legal/repair-invoices' },
        { name: '發票', href: '/dashboard/legal/invoices' },
        { name: '產權證明書', href: '/dashboard/legal/ownership' },
        { name: '轉讓證明書', href: '/dashboard/legal/transfer-bill' }
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
        {/* 用户组件 */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <UserBadge />
        </div>

        {/* 导航目录 */}
        <nav className="space-y-6 flex-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {/* 一级目录 */}
              {item.href ? (
                <Link href={item.href} className="text-sm font-bold text-gray-800 uppercase tracking-wider hover:text-blue-600 block">
                  {item.name}
                </Link>
              ) : (
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {item.name}
                </div>
              )}
              
              {/* 二级目录 */}
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