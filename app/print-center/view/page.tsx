import { createClient } from '@/lib/supabase-server';
import InvoiceTemplate from '@/components/templates/InvoiceTemplate';
import OwnershipTemplate from '@/components/templates/OwnershipTemplate';
import TransferTemplate from '@/components/templates/TransferTemplate';

export default async function ViewPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ id: string; type: string }> 
}) {
  const { id, type } = await searchParams;
  const supabase = await createClient();
  
  const table = type === 'repair' ? 'repairs' : 'orders'; 
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();

  if (error || !data) return <div>找不到文件</div>;

  // 渲染函數，使用型別安全的方式傳遞 data
  const renderTemplate = () => {
    // 這裡的 data 會被視為 any，因為來自 supabase 的動態數據結構不固定
    // 如果您需要更嚴格的類型，建議在每個模板中定義 interface
    switch (type) {
      case 'invoice': 
        return <InvoiceTemplate data={data as any} />;
      case 'title': 
        return <OwnershipTemplate data={data as any} />;
      case 'transfer': 
        return <TransferTemplate data={data as any} />;
      default: 
        return <div>文件類型錯誤</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {renderTemplate()}
      <script dangerouslySetInnerHTML={{ __html: `window.print();` }} />
    </div>
  );
}