'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function TransfersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('orders').select('*').eq('user_id', user.id).then(({ data }) => setOrders(data || []));
      }
    });
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">轉讓證明管理</h1>
      <table className="w-full border">
        <thead><tr className="bg-gray-50 border-b"><th className="p-4">產品</th><th className="p-4">UID</th><th className="p-4">操作</th></tr></thead>
        <tbody>
          {orders.map((o) => {
            const item = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
            return (
              <tr key={o.id} className="border-b">
                <td className="p-4">{item.name}</td>
                <td className="p-4 font-mono">{item.uid}</td>
                <td className="p-4"><button onClick={() => window.open(`/print-center?id=${o.id}&type=transfer`, '_blank')} className="bg-green-600 text-white px-3 py-1 rounded text-xs">打印轉讓證明</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}