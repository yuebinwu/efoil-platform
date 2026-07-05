import { createClient } from '@/lib/supabase-server';
import TransferTemplate from '@/components/templates/TransferTemplate';
import InvoiceTemplate from '@/components/templates/InvoiceTemplate'; // 记得引入

export default async function ViewPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ id: string; type: string }> 
}) {
  const params = await searchParams;
  const { id, type } = params;
  
  const supabase = await createClient();
  
  // 使用关联查询显式获取 profiles
  const { data, error } = await supabase
    .from(type === 'transfer' ? 'transfers' : 'orders')
    .select(`
      *,
      profiles ( full_name, phone, street_address, city, state, postal_code, remarks )
    `)
    .eq('id', id.trim())
    .single();

  if (error || !data) {
    return <div className="p-10 text-center">無法找到記錄 (ID: {id})</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {type === 'transfer' ? (
        <TransferTemplate data={data} />
      ) : (
        <InvoiceTemplate data={data} />
      )}
      <script dangerouslySetInnerHTML={{ __html: `window.print();` }} />
    </div>
  );
}