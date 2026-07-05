//
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface Order {
  id: string;
  user_id: string;
  items: {
    name: string;
    uid: string;
  };
}

export default function RepairRequestPage({ params }: { params: { id: string } }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('orders')
      .select('id, user_id, items')
      .eq('id', params.id)
      .single()
      .then(({ data }) => setOrder(data as Order));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!order) return;
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('repairs').insert({
      user_id: order.user_id,
      product_name: order.items.name,
      uid: order.items.uid,
      description: formData.get('description') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      status: 'Pending'
    });

    if (error) {
      alert('申請失敗: ' + error.message);
    } else {
      alert('維修申請已提交！');
      window.location.href = '/dashboard/repairs';
    }
    setLoading(false);
  };

  if (!order) return <div className="p-8">載入訂單資料中...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">填寫維修申請單</h1>
      
      <div className="bg-gray-50 p-4 border rounded mb-6">
        <p className="text-sm text-gray-500">產品綁定資訊</p>
        <p className="font-bold text-lg">{order.items.name}</p>
        <p className="text-blue-600 font-mono text-xl font-bold">UID: {order.items.uid}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea name="description" placeholder="故障問題詳細描述..." required className="w-full border p-2 rounded" rows={4} />
        <input name="phone" placeholder="聯絡電話" required className="w-full border p-2 rounded" />
        <input name="address" placeholder="收件/維修地址" required className="w-full border p-2 rounded" />
        
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
          {loading ? '提交中...' : '送出申請'}
        </button>
      </form>
    </div>
  );
}