'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitTransfer(formData: FormData) {
  const supabase = createClient();

  const orderId = formData.get('order_no') as string;
  const qty = parseInt(formData.get('quantity') as string);
  
  // 1. 先讀取舊庫存 (繞過 supabase.sql 錯誤)
  const { data: order, error: fetchErr } = await supabase
    .from('orders')
    .select('quantity')
    .eq('id', orderId)
    .single();

  if (fetchErr || !order) throw new Error('無法找到訂單');

  // 2. 更新庫存
  const { error: err1 } = await supabase
    .from('orders')
    .update({ quantity: order.quantity - qty })
    .eq('id', orderId);
  if (err1) throw new Error('庫存扣減失敗');

  // 3. 寫入 ownership_transfers
  await supabase.from('ownership_transfers').insert({
    order_id: orderId,
    quantity: qty,
    created_at: new Date().toISOString()
  });

  // 4. 寫入 transfers
  await supabase.from('transfers').insert({
    transfer_no: 'T' + Math.floor(Math.random() * 900000 + 100000),
    assignee_name: formData.get('assignee_name'),
    assignee_phone: formData.get('assignee_phone'),
    assignee_address: formData.get('assignee_address'),
    product_name: formData.get('product_name'),
    uid: formData.get('uid'),
    price: parseFloat(formData.get('price') as string),
    quantity: qty,
    package_status: formData.get('package_status'),
    created_at: new Date().toISOString()
  });

  revalidatePath('/dashboard/orders');
}