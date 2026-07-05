'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// 1. 定义数据接口，消除 any
interface ItemData {
  name?: string;
  model?: string;
  description?: string;
  uid?: string;
}

interface InvoiceOrder {
  id: string;
  created_at: string;
  status: string;
  uid?: string;
  unit_price: number;
  quantity?: number;
  items: ItemData | string;
}

export default function InvoicesPage() {
  const [orders, setOrders] = useState<InvoiceOrder[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        console.log("查询到的原始数据:", data); // <--- 请检查控制台这一行输出

      if (data) setOrders(data as InvoiceOrder[]);
    };
    fetchInvoices();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">發票管理</h1>
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
            const item = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || {});
            return (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-xs font-mono">{o.id.slice(0, 8)}</td>
                <td className="p-4">{item.name || '-'}</td>
                <td className="p-4">{item.model || '-'}</td>
                <td className="p-4 text-xs">{item.description || '-'}</td>
                <td className="p-4 font-mono">{o.uid || item.uid || '-'}</td>
                <td className="p-4">${Number(o.unit_price || 0).toLocaleString()}</td>
                <td className="p-4">{o.quantity || 1}</td>
                <td className="p-4 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-sm">{o.status || 'pending'}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => window.open(`/print-center?id=${o.id}&type=invoice`, '_blank')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
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
  );
}