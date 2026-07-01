import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

// --- 關鍵修正：加上這一段 ---
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // 處理未登入的情況，例如重定向到登入頁
    return <div>請先登入</div>;
  }

const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user?.id)             // 直接使用 user_id 欄位
    .neq('status', 'transferred')       // 關鍵：排除已轉讓的訂單
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">訂單與產權管理</h1>

      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b uppercase text-xs text-gray-500">
            <tr>
              <th className="p-4">訂單編號</th>
              <th className="p-4">產品名稱</th>
              <th className="p-4">型號</th>
              <th className="p-4">產品描述</th>
              <th className="p-4">唯一UID</th>
              <th className="p-4">價格</th>
              <th className="p-4">數量</th>
              <th className="p-4">購入時間</th>
              <th className="p-4">狀態</th>
              <th className="p-4">操作</th>
              <th className="p-4">轉讓文件</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono">{order.id.slice(0, 8)}</td>
                <td className="p-4 font-bold">{order.items?.name || 'N/A'}</td>
                <td className="p-4">{order.items?.model || 'N/A'}</td>
                <td className="p-4 truncate max-w-[120px]">{order.items?.description || '無'}</td>
                <td className="p-4 font-mono text-blue-600">{order.items?.uid || '未分配'}</td>
                
                {/* 修正點：優先取新欄位 unit_price，再取舊的 items.price */}
                <td className="p-4 font-bold">${(order.unit_price || order.items?.price || 0).toLocaleString()}</td>
                
                {/* 修正點：優先取新的 quantity 欄位，再取舊的 items.quantity 或 user_info.quantity */}
                <td className="p-4">{order.quantity || order.items?.quantity || order.user_info?.quantity || 1}</td>
                
                <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Owned</span>
                </td>
                <td className="p-4">
                  <Link href={`/dashboard/orders/${order.id}`} className="hover:underline text-gray-600">詳情</Link>
                </td>
                <td className="p-4">
                  <Link 
                    href={`/dashboard/orders/transfer/${order.id}`} 
                    className="text-blue-600 hover:underline font-bold"
                  >
                    填寫文件
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}