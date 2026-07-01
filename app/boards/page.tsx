// app/boards/page.tsx   2026-6-28 調試成功--跳轉--填寫--成功
'use client'

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BoardsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoards() {
      // 1. 增加過濾條件：只撈取 category 為 'boards' 的產品
      const { data, error } = await supabase
        .from('products')
        .select('name, image_url, price, category')
        .eq('category', 'boards'); 

      if (data) {
        // 2. 去重邏輯：每個名稱只保留第一筆資料
        const unique = data.filter((item, index, self) =>
          index === self.findIndex((p) => p.name === item.name)
        );
        setProducts(unique);
      }
      setLoading(false);
    }
    fetchBoards();
  }, []);

  if (loading) return <div className="p-10">載入中测试！...！</div>;

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-10">專業水上板系列</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.name} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="font-bold text-lg mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">價格: ${product.price}</p>
            
            <Link href={`/checkout?product=${encodeURIComponent(product.name)}`}>
              <button className="w-full bg-black text-white py-2 rounded">
                立即購買
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}