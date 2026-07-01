// app/actions/order.ts
'use server'

import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function createOrderAction(formData: FormData) {
  // 1. 获取 Session
  const { data: { session } } = await supabase.auth.getSession();

  // 2. 强制拦截：没有登入者，全部重定向到登录页
  if (!session) {
    redirect('/login');
  }

  // 3. 只有登入者能继续
  const productId = formData.get('product_id');
  
  const { error } = await supabase
    .from('orders')
    .insert([{ 
      user_id: session.user.id, 
      product_id: productId 
    }]);

  if (error) throw error;
  
  redirect('/orders/success');
}