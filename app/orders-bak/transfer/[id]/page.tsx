import { supabase } from '@/lib/supabase'; // 請確保路徑正確
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function TransferPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // 1. 處理表單提交的 Server Action
  async function submitTransfer(formData: FormData) {
    'use server'

    // 對應你的 10 個欄位
    const payload = {
      transfer_no: `T${Date.now().toString().slice(-11)}`, // 自動生成 12 位編號
      assignee_name: formData.get('assignee_name'),
      assignee_phone: formData.get('assignee_phone'),
      assignee_address: formData.get('assignee_address'),
      product_name: formData.get('product_name'),
      uid: id, // 這是頁面參數傳入的唯一 UID
      price: parseFloat(formData.get('price') as string || '0'),
      quantity: parseInt(formData.get('quantity') as string || '1'),
      package_status: formData.get('package_status'),
      remarks: formData.get('remarks'),
    };

    const { error } = await supabase.from('transfers').insert([payload]);

    if (error) {
      console.error('寫入錯誤:', error);
      throw new Error('提交失敗，請檢查資料');
    }

    // 成功後跳轉到成功頁面 (你可以建立一個簡單的 success 頁)
    redirect('/dashboard/orders/success');
  }

  // 2. UI 渲染 (這裡填入你的表單 HTML)
  return (
    <form action={submitTransfer}>
      <input name="assignee_name" placeholder="受讓人姓名" required />
      <input name="assignee_phone" placeholder="受讓人電話" required />
      <input name="assignee_address" placeholder="受讓人地址" required />
      <input name="product_name" placeholder="產品名稱" required />
      <input name="price" type="number" placeholder="成交價格" required />
      <input name="quantity" type="number" placeholder="轉讓數量" required />
      <input name="package_status" placeholder="包裝狀態" />
      <textarea name="remarks" placeholder="備註說明" />
      
      <button type="submit">確認提交轉讓申請</button>
    </form>
  );
}