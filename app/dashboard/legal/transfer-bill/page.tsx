'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// 1. 定义强类型接口，严格对应数据库字段
interface Transfer {
  id: string;
  assignee_name: string;
  assignee_phone: string;
  assignee_address: string;
  product_name: string;
  uid: string;
  price: number;
  quantity: number;
  package_status: string;
  created_at: string;
}

export default function TransferBillPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      // 2. 参照订单页逻辑：直接全量查询，不带 user_id 过滤
      const { data, error } = await supabase
        .from('transfers')
        .select(`
          id, assignee_name, assignee_phone, assignee_address, 
          product_name, uid, price, quantity, package_status, created_at
        `)
        .order('created_at', { ascending: false }); // 3. 统一排序逻辑

      if (error) {
        console.error("转让证明加载错误:", error);
        return;
      }

      if (data) {
        setTransfers(data as Transfer[]);
      }
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">轉讓證明管理</h1>
      
      <table className="w-full border-collapse border border-gray-200 text-xs">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2">受讓人姓名</th>
            <th className="border p-2">受讓人電話</th>
            <th className="border p-2">受讓人地址</th>
            <th className="border p-2">轉讓產品</th>
            <th className="border p-2">UID</th>
            <th className="border p-2">價格</th>
            <th className="border p-2">數量</th>
            <th className="border p-2">現狀</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="border p-2">{t.assignee_name}</td>
              <td className="border p-2">{t.assignee_phone}</td>
              <td className="border p-2">{t.assignee_address}</td>
              <td className="border p-2 font-bold">{t.product_name}</td>
              <td className="border p-2 font-mono text-blue-600">{t.uid}</td>
              <td className="border p-2">${t.price}</td>
              <td className="border p-2">{t.quantity}</td>
              <td className="border p-2">{t.package_status}</td>
              <td className="border p-2 text-center">
<button 
  type="button" // 添加这一行
  onClick={() => window.open(`/print-center?id=${t.id}&type=transfer`, '_blank')}
  className="bg-black text-white px-3 py-1 rounded font-bold hover:bg-gray-800 transition-colors"
>
  列印轉讓證書
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}