'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// 1. 定义产品项的接口 (对应 items 字段的结构)
interface OrderItem {
  name: string;
  model: string;
  description?: string;
  unit_price: number;
  quantity: number;
  uid?: string;
}

// 2. 定义订单数据的强类型接口
interface Order {
  id: string;
  created_at: string;
  status: string;
  uid?: string;
  items: OrderItem | string; // 处理可能是 string 或 object 的情况
  unit_price?: number;  // <--- 补上这一行，波浪线就会消失
}

export default function OwnershipPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 3. 规范化查询：添加排序逻辑
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        //.eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("加载数据错误:", error);
      } else if (data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [supabase]);

  if (loading) return <div className="p-8">載入中...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">產權證明管理</h1>
      
      {orders.length === 0 ? (
        <div className="p-10 text-center text-gray-500 border rounded">暫無數據</div>
      ) : (
        <table className="w-full text-left border border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 border">訂單編號</th>
              <th className="p-4 border">產品名稱</th>
              <th className="p-4 border">型號</th>
              
              <th className="p-4 border">唯一UID</th>
              <th className="p-4 border">價格</th>
              <th className="p-4 border">數量</th>
              <th className="p-4 border">購入時間</th>
              <th className="p-4 border">狀態</th>
              <th className="p-4 border text-center">操作</th>
            </tr>
          </thead>
            <tbody>
              {orders.map((o) => {
                // 1. 安全解析 items，如果为空则设为空对象
                const itemData = (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) || {};
                
                return (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-xs font-mono border">{o.id.slice(0, 8)}</td>
                    <td className="p-4 border">{itemData.name || '-'}</td>
                    <td className="p-4 border">-</td> {/* 型号目前为空 */}
                    
                    <td className="p-4 font-mono border">{o.uid || '-'}</td>
                    <td className="p-4 border">${Number(o.unit_price || 0).toLocaleString()}</td>
                    <td className="p-4 border">1</td> {/* 强制显示数量为1 */}
                    <td className="p-4 text-xs border">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-sm border">{o.status || 'pending'}</td>
                    <td className="p-4 text-center border">
                      <button 
                        type="button"
                        onClick={() => window.open(`/print-center?id=${o.id}&type=ownership`, '_blank')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        打印產權證
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
        </table>
      )}
    </div>
  );
}