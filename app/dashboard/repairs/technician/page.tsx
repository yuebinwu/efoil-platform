//2026-6-26 ok
'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function TechnicianRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchRepairs = async () => {
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error("資料獲取失敗:", error);
    else setRepairs(data || []);
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  // 這是完整的受理邏輯
  const handleAccept = async (id: string) => {
    const { error } = await supabase
      .from('repairs')
      .update({ 
        status: 'In Progress', 
        accepted_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      alert("受理失敗: " + error.message);
    } else {
      // 成功後重新讀取資料，按鈕會自動消失並變成「填寫報告」
      fetchRepairs();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">工程維修作業台</h1>
      
      <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
        <thead className="bg-gray-50 uppercase text-xs text-gray-500 font-bold">
          <tr>
            <th className="px-6 py-4">產品名稱</th>
            <th className="px-6 py-4">UID</th>
            <th className="px-6 py-4">狀態</th>
            <th className="px-6 py-4">提交時間</th>
            <th className="px-6 py-4">受理時間</th>
            <th className="px-6 py-4">完成時間</th>
            <th className="px-6 py-4">確認受理</th>
            <th className="px-6 py-4">填寫報告</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {repairs.length > 0 ? (
            repairs.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 font-bold">{r.product_name}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{r.uid}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-xs">{r.accepted_at ? new Date(r.accepted_at).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-xs">{r.completed_at ? new Date(r.completed_at).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">
                  {r.status === 'Pending' && (
                    <button 
                      onClick={() => handleAccept(r.id)} 
                      className="bg-blue-900 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-800"
                    >
                      確認受理
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  {r.status === 'In Progress' && (
                    <Link 
                    href={`/dashboard/repairs/report?id=${r.id}`} 
                    className="bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold"
                    >
                    填寫報告
                    </Link>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-500">目前沒有相關維修記錄</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}