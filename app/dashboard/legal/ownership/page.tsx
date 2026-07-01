'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function OwnershipPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id);
      if (data) setOrders(data);
    };
    fetchOrders();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">產權證明管理</h1>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-4">訂單編號</th>
            <th className="p-4">產品名稱</th>
            <th className="p-4">型號</th>
            <th className="p-4">產品描述</th>
            <th className="p-4">唯一UID</th>
            <th className="p-4">價格</th>
            <th className="p-4">數量</th>
            <th className="p-4">購入時間</th>
            <th className="p-4">狀態</th>
            <th className="p-4 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const item = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
            return (
              <tr key={o.id} className="border-b">
                <td className="p-4 text-xs font-mono">{o.id.slice(0, 8)}</td>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.model}</td>
                <td className="p-4 text-xs">{item.description || '-'}</td>
                <td className="p-4 font-mono">{item.uid || o.uid || '無'}</td>
                <td className="p-4">${Number(item.unit_price).toLocaleString()}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-sm">{o.status || '已完成'}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => window.open(`/print-center?id=${o.id}&type=ownership`, '_blank')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    打印產權證
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}