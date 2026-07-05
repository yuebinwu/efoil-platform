// checkout/page.tsx 订单插入数据库orders表  2026-7-2
'use client'

import { useState, useEffect, Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productName = searchParams.get('product');

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!productName) {
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('products')
        .select('name, price, description, image_url, uid, quantity, status')
        .eq('name', productName)
        .eq('status', 'available');

      if (data && data.length > 0) {
        const totalStock = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setProduct({ 
          ...data[0], 
          total_quantity: totalStock, 
          all_items: data 
        });
      }
      setLoading(false);
    }
    fetchProduct();
  }, [productName]);

  async function handlePurchase() {
    if (!product || product.total_quantity <= 0) {
      alert("庫存不足");
      return;
    }

    const targetItem = product.all_items.find((item: any) => item.status === 'available');
    
    // 1. 寫入訂單
    const { error: orderError } = await supabase.from('orders').insert([{
      items: { name: product.name },
      unit_price: product.price,
      quantity: 1,
      uid: targetItem.uid,
      status: 'pending'
    }]);

    if (orderError) {
      alert("訂單建立失敗: " + orderError.message);
      return;
    }

    // 2. 更新狀態為 'sold'
    const { error: updateError } = await supabase
      .from('products')
      .update({ status: 'sold' })
      .eq('uid', targetItem.uid);

    if (updateError) {
      alert("庫存扣除失敗: " + updateError.message);
    } else {
      alert("下單成功！");
      window.location.reload();
    }
  }

  if (loading) return <div className="p-10 text-center">載入中...</div>;
  if (!product) return <div className="p-10 text-center">該產品已售罄或不存在</div>;

  return (
    <div className="p-10 w-full flex justify-center">
      <div className="max-w-4xl w-full flex items-start gap-12">
        <div className="w-1/2">
          {product.image_url && <img src={product.image_url} alt={product.name} className="w-full shadow-lg rounded-lg" />}
        </div>
        <div className="w-1/2 pt-4">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-2">總庫存: {product.total_quantity}</p>
          <p className="text-2xl font-bold mb-4">價格: {product.price}</p>
          <p className="text-gray-600 mb-8">{product.description}</p>
          <button 
            className="bg-black text-white px-12 py-3 rounded hover:bg-gray-800 transition-colors" 
            onClick={handlePurchase}
          >
            確認下單
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">載入中...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}