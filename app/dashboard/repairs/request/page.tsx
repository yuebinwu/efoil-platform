'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // 請確認你的 Supabase 客戶端路徑
import { useRouter } from 'next/navigation';

export default function RepairRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    product_name: 'E-Foil Cruiser V2',
    serial_number: '',
    issue_description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 獲取當前登入用戶
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("請先登入");
      return;
    }

    // 寫入數據
    const { error } = await supabase.from('repairs').insert([
      {
        user_id: user.id, // 這裡會自動對應你的 user_id: be739fd3-...
        product_name: formData.product_name,
        serial_number: formData.serial_number,
        issue_description: formData.issue_description,
        status: 'pending'
      }
    ]);

    if (error) {
      console.error(error);
      alert("寫入失敗");
    } else {
      alert("維修記錄已建立！");
      router.push('/dashboard/repairs');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4">發起維修申請</h2>
      <input className="block w-full border p-2 mb-2" placeholder="產品名稱" value={formData.product_name} disabled />
      <input className="block w-full border p-2 mb-2" placeholder="產品序列號 (SN)" onChange={e => setFormData({...formData, serial_number: e.target.value})} />
      <textarea className="block w-full border p-2 mb-4" placeholder="問題描述" onChange={e => setFormData({...formData, issue_description: e.target.value})} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">送出維修請求</button>
    </form>
  );
}