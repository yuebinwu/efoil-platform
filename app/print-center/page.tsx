import { createClient } from '@/utils/supabase/server';
import InvoiceTemplate from '@/components/templates/InvoiceTemplate';

export default async function PrintCenterPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const supabase = createClient();
  const orderId = searchParams.id;

  if (!orderId) {
    return <div className="p-10 text-red-500">错误：未找到订单 ID</div>;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (
        full_name,
        street_address,
        city,
        state,
        postal_code,
        phone
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    return <div className="p-10 text-red-500">获取订单信息失败，请稍后再试。</div>;
  }

  return <InvoiceTemplate data={data} />;
}