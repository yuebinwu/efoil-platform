'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// 定义明确的数据接口，移除所有 any
interface ItemData {
  name?: string;
  description?: string;
  uid?: string;
  unit_price?: number;
}

interface InvoiceOrder {
  id: string;
  created_at: string;
  status: string;
  uid?: string;
  unit_price: number;
  quantity?: number;
  // 数据库 items 可能是数组或对象，在此进行兼容处理
  items: ItemData[] | ItemData | null;
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

      if (data) setOrders(data as InvoiceOrder[]);
    };
    fetchInvoices();
  }, [supabase]);

  // 安全提取 item 详情的辅助函数
  const getItemDetails = (items: InvoiceOrder['items']) => {
    if (!items) return { name: '-', description: '-' };
    
    // 如果是数组，取第一个元素
    const item = Array.isArray(items) ? items[0] : items;
    return {
      name: item.name || '-',
      description: item.description || '-'
    };
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">發票管理</h1>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-4">訂單編號</th>
            <th className="p-4">產品名稱</th>
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
            const { name, description } = getItemDetails(o.items);
            return (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-xs font-mono">{o.id.slice(0, 8)}</td>
                <td className="p-4">{name}</td>
                <td className="p-4 text-xs">{description}</td>
                <td className="p-4 font-mono">{o.uid || '-'}</td>
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