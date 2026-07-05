//
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// 定义维修记录的接口
interface Repair {
  id: string;
  product_name: string;
  uid?: string;
  status: string;
  created_at: string;
}

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);

  useEffect(() => {
    const fetchRepairs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('repairs')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) console.error("读取维修记录失败:", error);
      else setRepairs(data || []);
    };
    fetchRepairs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">維修紀錄</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left">產品名稱</th>
            <th className="p-4 text-left">UID</th>
            <th className="p-4 text-left">狀態</th>
            <th className="p-4 text-left">日期</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => (
            <tr key={repair.id} className="border-b">
              <td className="p-4">{repair.product_name}</td>
              <td className="p-4 font-mono">{repair.uid || 'N/A'}</td>
              <td className="p-4">{repair.status}</td>
              <td className="p-4">{new Date(repair.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}