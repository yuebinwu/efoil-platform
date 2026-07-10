import Link from 'next/link';
import UserBadge from '@/components/UserBadge'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 导航结构 (已保持原有格式)
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Messages', href: '/dashboard/messages' },
    { 
      name: 'Account Settings', 
      sub: [{ name: 'Profile', href: '/dashboard/profile' }] 
    },
    { 
      name: 'Purchases', 
      sub: [{ name: 'Orders & Ownership', href: '/dashboard/orders' }] 
    },
    { 
      name: 'Maintenance', 
      sub: [
        { name: 'Service Request', href: '/dashboard/repairs' }, 
        { name: 'Service History', href: '/dashboard/repairs/query' },
        { name: 'Service Log', href: '/dashboard/repairs/technician' }
      ] 
    },
    { 
      name: 'Legal Documents', 
      sub: [
        { name: 'Repair Invoices', href: '/dashboard/legal/repair-invoices' },
        { name: 'Invoices', href: '/dashboard/legal/invoices' },
        { name: 'Certificate of Ownership', href: '/dashboard/legal/ownership' },
        { name: 'Bill of Sale', href: '/dashboard/legal/transfer-bill' }
      ] 
    },
    { 
      name: 'Technical Support', 
      sub: [{ name: 'Manuals & Guides', href: '/dashboard/documents' }] 
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* User Badge */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <UserBadge />
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-6 flex-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {/* 统一的一级目录样式 */}
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="text-sm font-bold text-gray-800 uppercase tracking-wider hover:text-blue-600 block"
                >
                  {item.name}
                </Link>
              ) : (
                <div className="text-sm font-bold text-gray-800 uppercase tracking-wider block">
                  {item.name}
                </div>
              )}
              
              {/* 二级目录 */}
              {item.sub && (
                <div className="ml-2 mt-1 space-y-1">
                  {item.sub.map((sub) => (
                    <Link 
                      key={sub.name} 
                      href={sub.href} 
                      className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                    >
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