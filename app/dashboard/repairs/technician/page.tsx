'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface Repair {
  id: string;
  product_name: string;
  uid: string;
  status: string;
  created_at: string;
  repair_description?: string | null;
  repair_cost?: number | null;
  repairer_name?: string | null;
}

export default function TechnicianRepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setRepairs((data as Repair[]) || []);
    }
  }, [supabase]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile && ['technician', 'admin', 'owner'].includes(profile.role)) {
          setIsAuthorized(true);
          await fetchLogs();
        }
      }
      setLoading(false);
    };
    init();
  }, [supabase, fetchLogs]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!isAuthorized) return <div className="p-8 text-red-500">Access denied.</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Maintenance Log</h1>
      
      <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
        <thead className="bg-gray-50 uppercase text-xs text-gray-500 font-bold">
          <tr>
            <th className="px-6 py-4 text-left">Product</th>
            <th className="px-6 py-4 text-left">UID</th>
            <th className="px-6 py-4 text-left">Repairer</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Description</th>
            <th className="px-6 py-4 text-left">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {repairs.map((r) => (
            <tr key={r.id}>
              <td className="px-6 py-4 font-bold">{r.product_name}</td>
              <td className="px-6 py-4 text-xs font-mono text-gray-500">{r.uid}</td>
              <td className="px-6 py-4 text-xs">{r.repairer_name || '-'}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs ${r.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-600 max-w-[200px] truncate">{r.repair_description || '-'}</td>
              <td className="px-6 py-4 text-xs font-bold text-gray-900">
                {r.repair_cost != null ? `$${r.repair_cost.toFixed(2)}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}