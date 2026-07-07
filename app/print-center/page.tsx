import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import InvoiceTemplate, { InvoiceData } from '@/components/templates/InvoiceTemplate';
import OwnershipTemplate, { OwnershipData } from '@/components/templates/OwnershipTemplate';
import RepairTemplate, { RepairData } from '@/components/templates/RepairTemplate';
import TransferTemplate, { TransferData } from '@/components/templates/TransferTemplate';

// 定义页面可能接收的联合类型，消除 any
type PageData = InvoiceData | TransferData | OwnershipData | RepairData | null;

export default async function PrintCenterPage({
  searchParams,
}: {
  searchParams: { id: string; type?: string };
}) {
  const supabase = createClient();
  const id = searchParams.id;
  const type = searchParams.type || 'invoice';

  if (!id) return <div className="p-10 text-red-500">错误：未提供 ID</div>;

  let data: PageData = null;
  let error: PostgrestError | null = null;

  // 根据业务类型进行数据获取
if (type === 'transfer') {
    // 1. 先查询转让记录
    const { data: resData, error: resError } = await supabase
      .from('transfers')
      .select('*')
      .eq('id', id) // 此时先尝试用主键 id 查找，如果不匹配再尝试 uid
      .single();

    if (resError || !resData) {
      console.error("查询 transfers 失败:", resError);
      error = resError;
    } else {
      // 2. 手动去 profiles 表查询用户信息
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', resData.user_id)
        .single();
      
      // 3. 将两部分数据合并
      data = { 
        ...resData, 
        user_info: profileData || { userName: 'Valued Customer', email: 'N/A', phone: 'N/A' }
      } as TransferData;
    }
  
  } else if (type === 'ownership' || type === 'invoice') {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (full_name, street_address, city, state, postal_code, phone)
      `)
      .eq('id', id)
      .single();
    
    error = orderError;
    
    if (orderData) {
      // 直接处理 jsonb 格式的 items 字段
      const itemsRaw = typeof orderData.items === 'string' ? JSON.parse(orderData.items) : orderData.items;
      
      data = { 
        ...orderData, 
        items: Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw]
      } as InvoiceData;
    }
  } else if (type === 'repair') {
    const { data: repData, error: repError } = await supabase.from('repairs').select('*').eq('id', id).single();
    data = repData as RepairData;
    error = repError;
  }

  // 错误处理
  if (error || !data) {
    return <div className="p-10 text-red-500">无法找到 ID: {id} 的记录</div>;
  }

  // 根据类型进行类型分发，并确保类型安全
  switch (type) {
    case 'transfer': 
      return <TransferTemplate data={data as TransferData} />;
    case 'ownership': 
      return <OwnershipTemplate data={data as OwnershipData} />;
    case 'repair': 
      return <RepairTemplate data={data as RepairData} />;
    case 'invoice':
    default: 
      return <InvoiceTemplate data={data as InvoiceData} />;
  }
}