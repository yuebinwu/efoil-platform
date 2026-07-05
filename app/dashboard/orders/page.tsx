//2026-7-3  去掉三目计算，取消owned状态  增加排序 
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

// 定义订单数据的强类型接口
interface Order {
      id: string;
      uid: string;
      user_id:string;
      unit_price: number;
      quantity: number;
      created_at: string;
      status: 'pending' | 'sold';
      items?: {
        name: string;
      };
    }

export default function OrderListPage() {
  // 替换 any，使用 Order[] 类型
  const [orders, setOrders] = useState<Order[]>([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

useEffect(() => {
    async function fetchData() {
      // 1. 直接获取所有数据，不做任何 user_id 过滤
      // 确保 items 表联查的字段名是正确的 (items!inner 或者 items)
      const { data, error } = await supabase
        .from('orders')
          .select(`
            id,
            uid,
            user_id,
            unit_price,
            quantity,
            created_at,
            status,
            items
          `)
        .order('status', { ascending: true }); // 只做排序

      if (error) {
        console.error("数据加载错误:", error);
        return;
      }

      if (data) {
        console.log("成功抓取数据:", data); // 调试用，右键点检查-控制台查看
        setOrders(data as Order[]);
      }
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">訂單與產權管理</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2">訂單編號</th>
            <th className="border p-2">產品名稱</th>
            <th className="border p-2">唯一-UID</th>
            <th className="border p-2">價格</th>
            <th className="border p-2">數量</th>
            <th className="border p-2">購入時間</th>
            <th className="border p-2">狀態</th>
            <th className="border p-2">操作</th>
            <th className="border p-2">轉讓文件</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id.slice(0, 8)}</td>
              <td className="border p-2">{order.items?.name}</td>
              <td className="border p-2 text-blue-600">{order.uid}</td>
              <td className="border p-2">${order.unit_price}</td>
              <td className="border p-2">{order.quantity}</td>
              <td className="border p-2">{new Date(order.created_at).toLocaleDateString()}</td>
              
              <td className="border p-2 text-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'sold' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {order.status}
                </span>
              </td>
 
              <td className="border p-2 text-blue-600 cursor-pointer text-center">詳情</td>
              
              <td className="border p-2 text-center">
                {order.status === 'pending' ? (
                  <Link 
                    href={`/dashboard/orders/transfer/${order.id}`} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    填寫文件
                  </Link>
                ) : (
                  <span className="text-gray-400 text-sm">已轉讓</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}