'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import DocumentHeader from '../DocumentHeader';

export default function TransferTemplate({ data }: { data: any }) {
  const [transfer, setTransfer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. 取得當前訂單資料中的 uid (因為傳入的 data 是整筆訂單資訊)
        const item = typeof data.items === 'string' ? JSON.parse(data.items) : (data.items || {});
        const targetUid = item.uid;

        if (targetUid) {
          // 2. 使用 uid 去 transfers 表查詢 (而不是用訂單 ID)
          const { data: transferData, error } = await supabase
            .from('transfers')
            .select('*')
            .eq('uid', targetUid)
            .single();

          if (transferData) {
            setTransfer(transferData);
          } else {
            console.error('查詢無結果:', error);
          }
        }
      } catch (err) {
        console.error('執行錯誤:', err);
      } finally {
        setLoading(false);
      }
    };

    if (data) fetchData();
  }, [data, supabase]);

  if (loading) return <div className="p-12">正在安全讀取轉讓資訊...</div>;
  if (!transfer) return (
    <div className="p-12 text-red-500">
      <p>錯誤：無法找到此產品的轉讓記錄。</p>
      <p className="text-sm">請確認資料庫中 UID: {typeof data.items === 'string' ? JSON.parse(data.items).uid : data.items?.uid} 是否存在於 transfers 表中。</p>
    </div>
  );

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      <DocumentHeader title="產品轉讓證明 (PRODUCT TRANSFER CERTIFICATE)" refNumber={transfer.transfer_no || 'N/A'} />
      
      <div className="space-y-6 mt-12">
        <section className="p-6 border border-black bg-gray-50">
          <h2 className="font-bold border-b border-black mb-4 uppercase">1. Transferee Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {transfer.assignee_name}</p>
            <p><strong>Phone:</strong> {transfer.assignee_phone}</p>
            <p className="col-span-2"><strong>Address:</strong> {transfer.assignee_address}</p>
          </div>
        </section>

        <section className="p-6 border border-black">
          <h2 className="font-bold border-b border-black mb-4 uppercase">2. Product Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Product Name:</strong> {transfer.product_name}</p>
            <p><strong>UID:</strong> {transfer.uid}</p>
            <p><strong>Price:</strong> ${Number(transfer.price || 0).toLocaleString()}</p>
            <p><strong>Status:</strong> {transfer.package_status}</p>
          </div>
        </section>
      </div>

      <button onClick={() => window.print()} className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded w-full">
        打印轉讓證書
      </button>
    </div>
  );
}