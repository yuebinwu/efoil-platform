//今天正常
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function TransferPage({ params }: { params: { id: string } }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  // 1. 載入產品諮詢區資訊
  useEffect(() => {
    supabase.from('orders').select('id, items').eq('id', params.id).single().then(({ data }) => setOrder(data));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const qtyToTransfer = parseInt(formData.get('quantity') as string);

    try {
      // 1. 取得當前訂單資訊
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .single();

      if (currentOrder.quantity < qtyToTransfer) throw new Error("庫存不足");

      // 2. 更新原訂單數量
      await supabase
        .from('orders')
        .update({ quantity: currentOrder.quantity - qtyToTransfer })
        .eq('id', params.id);

      // 3. 建立受讓人的新訂單
      // ⚠️ 注意：這裡需要受讓人的 user_id。如果受讓人還沒註冊，可能需要先存入一個「待領取」表
      await supabase.from('orders').insert({
        user_info: { userName: formData.get('assignee_name') }, // 或其他欄位
        items: currentOrder.items,
        quantity: qtyToTransfer,
        status: 'owned',
        created_at: new Date().toISOString()
      });

      // 4. 記錄轉讓歷史
      await supabase.from('transfers').insert({
        // ... 填寫您的轉讓詳情
      });

      alert('轉讓成功！庫存已更新。');
      window.location.href = '/dashboard/orders';
    } catch (err: any) {
      alert('錯誤: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <p>載入中...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold border-b pb-4">產品轉讓申請書</h1>

      {/* 產品資訊諮詢區 */}
      <section className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-sm font-bold mb-4 text-gray-500">1. 產品綁定資訊</h2>
        <div className="grid grid-cols-3 gap-8">
          <div><p className="text-xs text-gray-400">訂單編號</p><p className="font-bold">{order.id}</p></div>
          <div><p className="text-xs text-gray-400">產品名稱</p><p className="font-bold">{order.items?.name}</p></div>
          <div><p className="text-xs text-gray-400">唯一 UID</p><p className="font-mono text-blue-600">{order.items?.uid}</p></div>
        </div>
      </section>

      {/* 轉讓填寫區 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-lg font-bold border-b pb-2">2. 轉讓人與受讓人資訊填寫</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="assignee_name" placeholder="受讓人姓名" required className="border p-2 w-full" />
          <input name="assignee_phone" placeholder="受讓人電話" required className="border p-2 w-full" />
        </div>
        <input name="assignee_address" placeholder="受讓人地址" required className="border p-2 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" placeholder="轉讓價格" required className="border p-2 w-full" />
          <input name="quantity" type="number" defaultValue="1" required className="border p-2 w-full" />
        </div>
        <select name="package_status" className="border p-2 w-full">
          <option value="New">全新 (New)</option>
          <option value="Used">已使用 (Used)</option>
        </select>
        {/* 備註欄位 */}
        <textarea name="remarks" placeholder="如有其他需求請填寫在此..." className="border p-2 w-full" rows={3} />
        
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded">
          {loading ? '提交中...' : '確認提交'}
        </button>
      </form>
    </div>
  );
}