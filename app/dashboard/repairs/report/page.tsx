//2026-6-26  ok
'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// 1. 將所有邏輯放在這個元件中
function ReportContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const { error } = await supabase
      .from('repairs')
      .update({
        repair_description: description,
        repair_cost: cost,
        status: 'Completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      alert("提交失敗: " + error.message);
    } else {
      alert("報告已提交，維修流程結束！");
      router.push('/dashboard/repairs/technician');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">填寫維修報告 (工單 ID: {id})</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">維修描述</label>
          <textarea 
            className="w-full border p-2 rounded-lg"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">維修費用</label>
          <input 
            type="number"
            className="w-full border p-2 rounded-lg"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600">
          提交報告並完成維修
        </button>
      </form>
    </div>
  );
}

// 2. 必須使用 Suspense 包裹，這是解決「頁面卡住/轉圈」的關鍵
export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-10">載入中...</div>}>
      <ReportContent />
    </Suspense>
  );
}