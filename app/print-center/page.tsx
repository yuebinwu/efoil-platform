'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import InvoiceTemplate from '@/components/templates/InvoiceTemplate'; // 您已修好的發票模板
import RepairTemplate from '@/components/templates/RepairTemplate';     // 您要修的維修單模板
import OwnershipTemplate from '@/components/templates/OwnershipTemplate';
import TransferTemplate from '@/components/templates/TransferTemplate';

function PrintContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const [data, setData] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!id || !type) return;
    
    // 核心修正：根據 type 決定查詢哪一張表
    const tableName = type === 'repair' ? 'repairs' : 'orders';
    
    supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setData(data));
  }, [id, type, supabase]);

  if (!data) return <div className="p-8">載入中...</div>;

  // 根據 type 分發，發票邏輯完全保留不動
  if (type === 'invoice') return <InvoiceTemplate data={data} />;
  if (type === 'repair') return <RepairTemplate data={data} />;
  if (type === 'ownership') return <OwnershipTemplate data={data} />;
  if (type === 'transfer') return <TransferTemplate data={data} />;
  
  return <div>找不到對應模板</div>;
}

export default function PrintPage() {
  return <Suspense fallback={<div>Loading...</div>}><PrintContent /></Suspense>;
}