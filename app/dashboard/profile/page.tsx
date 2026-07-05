'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// 美国 51 个行政区 (50个州 + DC)
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", 
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", 
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

interface ProfileData {
  full_name: string; phone: string; street_address: string; city: string;
  state: string; postal_code: string; address_line_2: string; remarks: string;
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({
    full_name: '', phone: '', street_address: '', city: '', 
    state: '', postal_code: '', address_line_2: '', remarks: ''
  });
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) setData(profile);
    };
    fetchProfile();
  }, [supabase]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
    alert(error ? '保存失败: ' + error.message : '信息已成功更新');
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">用户信息</h1>
      <div className="space-y-4">
        <input className="w-full border p-2" placeholder="用户全名" value={data.full_name} onChange={e => setData({...data, full_name: e.target.value})} />
        <input className="w-full border p-2" placeholder="电话" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
        <input className="w-full border p-2" placeholder="街道地址1" value={data.street_address} onChange={e => setData({...data, street_address: e.target.value})} />
        <input className="w-full border p-2" placeholder="街道地址2" value={data.address_line_2} onChange={e => setData({...data, address_line_2: e.target.value})} />
        
        <div className="grid grid-cols-3 gap-4">
          <input className="border p-2" placeholder="城市" value={data.city} onChange={e => setData({...data, city: e.target.value})} />
          <select className="border p-2" value={data.state} onChange={e => setData({...data, state: e.target.value})}>
             <option value="">选择州</option>
             {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="border p-2" placeholder="邮编" value={data.postal_code} onChange={e => setData({...data, postal_code: e.target.value})} />
        </div>
        
        <textarea className="w-full border p-2" placeholder="备注" value={data.remarks} onChange={e => setData({...data, remarks: e.target.value})} />
        
        <button onClick={handleSave} className="w-full bg-black text-white p-3 font-bold hover:bg-gray-800">保存信息</button>
      </div>
    </div>
  );
}