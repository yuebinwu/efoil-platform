//2026-6-26
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function NewRepairPage() {
  const [loading, setLoading] = useState(false);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [form, setForm] = useState({ uid: '', product_name: '', description: '', phone: '', address: '' });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 獲取申請列表
  const fetchRepairs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('repairs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setRepairs(data || []);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('請先登入');

      const { error } = await supabase.from('repairs').insert({
        user_id: user.id,
        ...form,
        status: 'Pending',
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      
      alert('維修申請已提交！');
      setForm({ uid: '', product_name: '', description: '', phone: '', address: '' });
      fetchRepairs(); // 成功後刷新列表
    } catch (err: any) {
      alert(err.message || '申請失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 左側：申請表單 */}
      <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">提交維修申請</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="產品 UID" value={form.uid} onChange={e => setForm({...form, uid: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900" />
          <input placeholder="產品名稱" value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900" />
          <textarea placeholder="請詳細描述故障狀況..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-900" />
          <input placeholder="聯絡電話" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900" />
          <input placeholder="收件地址" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900" />
          <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition">
            {loading ? '提交中...' : '確認提交申請'}
          </button>
        </form>
      </div>

      {/* 右側：申請紀錄列表 (固定高度並啟用捲動) */}
      <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl">
        <h2 className="text-xl font-bold mb-6">維修申請紀錄</h2>
        <div className="space-y-4 h-[500px] overflow-y-auto pr-2">
          {repairs.map((r) => (
            <div key={r.id} className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800">{r.product_name}</span>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                  r.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {r.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">UID: {r.uid}</div>
              <div className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}