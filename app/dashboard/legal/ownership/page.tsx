import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function OwnershipPage() {
  const supabase = createClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div className="p-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-6">產權證明管理</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">訂單編號</th>
              <th className="border p-2">產品名稱</th>
              <th className="border p-2">唯一—UID</th>
              <th className="border p-2">價格</th>
              <th className="border p-2">數量</th>
              <th className="border p-2">購入時間</th>
              <th className="border p-2">狀態</th>
              <th className="border p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // 统一从 items 字段解析
              let item: any = {};
              try {
                const parsed = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                item = Array.isArray(parsed) ? parsed[0] : parsed;
              } catch (e) {
                console.error("Parse error:", e);
              }
              
              // 强制从 item 内部获取字段
              const productName = item?.name || 'N/A';
              // 这里修正：明确从 item 读取 unit_price 或 price
              const price = item?.unit_price || item?.price || 0;

              return (
                <tr key={order.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{order.id.slice(0, 8)}</td>
                  <td className="border p-2 font-medium text-blue-700">{productName}</td>
                  <td className="border p-2">{order.uid || '-'}</td>
                  <td className="border p-2">${Number(price).toLocaleString()}</td>
                  <td className="border p-2">{order.quantity || 1}</td>
                  <td className="border p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="border p-2">{order.status || 'pending'}</td>
                  <td className="border p-2">
<Link 
  href={`/print-center?id=${order.id}&type=ownership`}
  // 在这里添加 target="_blank" 和 rel="noopener noreferrer"
  target="_blank" 
  rel="noopener noreferrer"
  className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
>
  打印產權證
</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}