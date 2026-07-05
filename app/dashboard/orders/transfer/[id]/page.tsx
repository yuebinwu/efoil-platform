//
'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function TransferRequestPage() {
  const [formData, setFormData] = useState({
    product_name: '',
    uid: '',
    assignee_name: '',
    assignee_address: '',
    assignee_phone: '',
    price: '',
    package_status: '',
    remarks: ''
  });

  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProductData = async () => {
      if (!orderId) return;
      const { data: orderData } = await supabase.from('orders').select('uid').eq('id', orderId).single();
      if (orderData?.uid) {
        const { data: productData } = await supabase.from('products').select('name, uid').eq('uid', orderData.uid).single();
        if (productData) {
          setFormData(prev => ({ ...prev, product_name: productData.name || '', uid: productData.uid || '' }));
        }
      }
    };
    fetchProductData();
  }, [orderId, supabase]);

  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    // 修复：移除导致报错的 order_id 字段，保留确认存在的 user_id
    const { error: insertError } = await supabase.from('transfers').insert([{
      user_id: user?.id || null, 
      product_name: formData.product_name,
      uid: formData.uid,
      assignee_name: formData.assignee_name,
      assignee_address: formData.assignee_address,
      assignee_phone: formData.assignee_phone,
      price: formData.price,
      package_status: formData.package_status,
      remarks: formData.remarks,
      transfer_no: crypto.randomUUID(),
      quantity: '1' // 必须明确包含此字段以满足数据库的非空约束
    }]);

    if (insertError) {
      alert("提交失败: " + insertError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ status: 'Sold' }) 
      .eq('uid', formData.uid);

    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({ status: 'Sold' })
      .eq('id', orderId);

    if (updateError || orderUpdateError) {
      alert("申请已提交，但状态同步更新失败: " + (updateError?.message || orderUpdateError?.message));
    } else {
      router.refresh(); 
      alert("转让申请成功，产品状态已更新为 Sold");
      router.push('/dashboard/orders');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">產品轉讓申請</h1>
      <form onSubmit={handleTransfer} className="space-y-4 bg-white p-6 border rounded-lg shadow-sm">
        <div className="border p-4 rounded-lg bg-gray-50">
          <p className="text-xs font-bold text-blue-600 mb-2">系统自动绑定信息</p>
          <input readOnly value={formData.product_name} className="w-full border p-2 rounded mb-2 bg-gray-100" />
          <input readOnly value={formData.uid} className="w-full border p-2 rounded bg-gray-100" />
        </div>
        <input required placeholder="受讓人姓名" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, assignee_name: e.target.value})} />
        <input required placeholder="受讓人地址" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, assignee_address: e.target.value})} />
        <input required placeholder="受讓人電話" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, assignee_phone: e.target.value})} />
        <input placeholder="轉讓價格" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, price: e.target.value})} />
        <input placeholder="包裝狀態" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, package_status: e.target.value})} />
        <textarea placeholder="備註" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, remarks: e.target.value})} />
        <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold">確認提交轉讓</button>
      </form>
    </div>
  );
}