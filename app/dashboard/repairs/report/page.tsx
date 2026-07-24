//
'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

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

    // 1. 获取当前登录用户的 ID (即维修人)
    const { data: { user } } = await supabase.auth.getUser();

    // 2. 提交数据，同时绑定 assigned_to
    const { error } = await supabase
      .from('repairs')
      .update({
        repair_description: description,
        repair_cost: parseFloat(cost), // 确保费用为数值类型
        assigned_to: user?.id,        // 自动绑定当前填报人的 ID
        status: 'Completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      alert("提交失敗: " + error.message);
    } else {
      alert("報告已提交，責任人已綁定，維修流程結束！");
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
            step="0.01"
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

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-10">載入中...</div>}>
      <ReportContent />
    </Suspense>
  );
}