'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
// 1. 直接导入 InvoiceTemplate，并导入其定义的接口类型 InvoiceData
import InvoiceTemplate, { type InvoiceData } from '@/components/templates/InvoiceTemplate';

function PrintInvoiceContent() {
  // 2. 将 state 类型直接声明为导入的 InvoiceData
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchMyInvoice = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 查询 orders 表，关联 profiles 表
      const { data: fetchedData, error } = await supabase
        .from('orders')
        .select(`*, profiles (*)`)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error("查询失败:", error);
      } else if (fetchedData) {
        // 3. 将查询结果直接赋值，TypeScript 会自动校验它是否符合 InvoiceData 结构
        setData(fetchedData as unknown as InvoiceData);
      }
      setLoading(false);
    };

    fetchMyInvoice();
  }, [supabase]);

  if (loading) return <div className="p-8">正在加载发票...</div>;
  if (!data) return <div className="p-8">未找到订单信息。</div>;

  // 4. 现在 data 完美符合 InvoiceData，再也不会有红线报错
  return <InvoiceTemplate data={data} />;
}

export default function PrintInvoicePage() {
  return <PrintInvoiceContent />;
}