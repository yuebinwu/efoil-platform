'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

interface Repair {
  id: string;
  product_name: string;
  uid: string;
  description?: string;
  status: string;
  created_at: string;
  accepted_at?: string;
  completed_at?: string;
  // 新增字段
  repair_description?: string;
  repair_cost?: number;
}

export default function TechnicianRepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [isTechnician, setIsTechnician] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile?.role === 'technician') setIsTechnician(true);
      }

      // 查询数据时，Supabase 默认会返回所有列
      const { data, error } = await supabase
        .from('repairs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Fetch error:", error);
      } else {
        setRepairs(data || []);
      }
    };
    initData();
  }, [supabase]);

  const handleAccept = async (id: string) => {
    const { error } = await supabase
      .from('repairs')
      .update({ status: 'In Progress', accepted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) alert("Error: " + error.message);
    else window.location.reload(); 
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Repair Technician Console</h1>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-sm font-bold">Product</th>
              <th className="p-4 text-sm font-bold">UID</th>
              <th className="p-4 text-sm font-bold">Issue Description</th>
              <th className="p-4 text-sm font-bold">Repair Description</th>
              <th className="p-4 text-sm font-bold">Repair Cost</th>
              <th className="p-4 text-sm font-bold">Status</th>
              <th className="p-4 text-sm font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {repairs.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">{r.product_name}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{r.uid}</td>
                <td className="px-6 py-4 text-xs truncate max-w-[150px]" title={r.description}>{r.description || '-'}</td>
                {/* 新增字段显示 */}
                <td className="px-6 py-4 text-xs truncate max-w-[150px]" title={r.repair_description}>{r.repair_description || '-'}</td>
                {/* <td className="px-6 py-4 text-xs">{r.repair_cost ? `$${r.repair_cost.toFixed(2)}` : '-'}</td> */}
                <td className="px-6 py-4 text-xs">
                  {r.repair_cost !== null && r.repair_cost !== undefined ? `$${r.repair_cost.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${r.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-center gap-2">
                  {isTechnician && (
                    <>
                      {r.status === 'pending' && (
                        <button onClick={() => handleAccept(r.id)} className="bg-blue-900 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-800">Accept</button>
                      )}
                      <Link href={`/dashboard/repairs/report?id=${r.id}`} className="bg-green-700 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-800">Report</Link>
                    </>
                  )}
                  <button onClick={() => window.open(`/print-center?id=${r.id}&type=repair`, '_blank')} className="bg-black text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-800">Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}