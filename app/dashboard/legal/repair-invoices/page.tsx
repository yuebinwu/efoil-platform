'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function RepairInvoicesPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchRepairs = async () => {
      // 確保我們從 'repairs' 表獲取資料，這樣欄位才會有狀態與時間
      const { data, error } = await supabase
        .from('repairs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setRepairs(data || []);
      else console.error("資料獲取錯誤:", error);
    };
    fetchRepairs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">維修單管理</h1>
      <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="p-4 text-xs font-bold text-gray-400 uppercase">產品名稱</th>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase">UID</th>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase">申請日期</th>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase">狀態</th>
            <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {repairs.length > 0 ? (
            repairs.map((r) => (
              <tr key={r.id}>
                <td className="p-4 font-bold text-gray-800">{r.product_name}</td>
                <td className="p-4 text-xs font-mono text-gray-500">{r.uid}</td>
                <td className="p-4 text-gray-600">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</td>
                <td className="p-4">
                   <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">{r.status || 'Pending'}</span>
                </td>
                <td className="p-4 text-center">
                    <button 
                    onClick={() => {
                        // 確保這裡傳遞的是該維修記錄的唯一 ID
                        window.open(`/print-center?id=${r.id}&type=repair`, '_blank');
                    }}
                    className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                    >
                    打印維修單
                    </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">目前沒有可打印的維修單記錄</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}