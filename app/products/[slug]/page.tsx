//  vercel布置检测的要求

'use client'

import { useState } from 'react';
import { createOrderAction } from '@/app/actions/order';

const productMap: Record<string, { name: string; price: number; image: string }> = {
  'cruiser': { name: 'E-Foil Cruiser V2', price: 5000, image: '/board-beginner.jpg' },
  'racer': { name: 'E-Foil Racer V2', price: 6000, image: '/board-intermediate.jpg' },
  'pro': { name: 'E-Foil Wave V2', price: 9800, image: '/board-pro.jpg' },
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(false);
  const product = productMap[params.slug];

  if (!product) {
    return <div className="p-8 text-2xl font-bold">找不到此產品 (Slug: {params.slug})</div>;
  }

  // 下單處理函數
    const handlePurchase = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        
        // 确保 items 包含 name: product.name
        // 将对象序列化为 JSON 字符串存入 FormData
        const itemsData = [{ 
            name: product.name, 
            price: product.price 
        }];
        
        formData.append('items', JSON.stringify(itemsData));
        formData.append('total_amount', product.price.toString());
        formData.append('user_id', ''); 

        await createOrderAction(formData);
        alert('下单成功！');
      } catch (err) {
        console.error(err);
        alert('下单失败');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
      
      <div className="mb-8 border rounded-lg overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-[400px] object-cover"
        />
      </div>

      <div className="text-xl mb-8">價格: ${product.price}</div>
      
      {/* 這裡補上了按鈕渲染 */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 transition"
      >
        {loading ? '處理中...' : '立即購買'}
      </button>
    </div>
  );
}