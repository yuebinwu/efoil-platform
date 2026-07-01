//
'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function InvoicesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">發票管理</h1>
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
              <th className="p-4 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => {
              // 根據您提供的 JSON 結構進行精確解析
              let itemData = { name: 'N/A', model: 'N/A', description: '無', uid: '無', unit_price: 0, quantity: 1 };
              try {
                const parsed = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                if (parsed) {
                  itemData = {
                    name: parsed.name || 'N/A',
                    model: parsed.model || 'N/A',
                    description: parsed.description || '無',
                    uid: parsed.uid || '無',
                    unit_price: parsed.unit_price || 0,
                    quantity: parsed.quantity || 1
                  };
                }
              } catch (e) { console.error("解析失敗", e); }

              return (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono">{o.id?.slice(0, 8)}</td>
                  <td className="p-4 font-bold">{itemData.name}</td>
                  <td className="p-4">{itemData.model}</td>
                  <td className="p-4 text-gray-500">{itemData.description}</td>
                  <td className="p-4 font-mono text-blue-600">{itemData.uid}</td>
                  <td className="p-4 font-bold">${Number(itemData.unit_price).toLocaleString()}</td>
                  <td className="p-4">{itemData.quantity}</td>
                  <td className="p-4">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Owned</span></td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => window.open(`/print-center?id=${o.id}&type=invoice`, '_blank')}
                      className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                    >
                      打印發票
                    </button>
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