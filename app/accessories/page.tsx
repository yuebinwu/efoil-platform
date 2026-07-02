//2026-6-27 改爲從storage取圖，Gemini狗屎
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function AccessoriesPage() {
  const supabase = await createClient();

  // 1. 從 Supabase 獲取所有 accessories 類別的產品
  const { data: items } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'accessories'); // 確保這裡為 'accessories'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">配件系列</h1>
      
      {/* 2. 產品列表網格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items?.map((item) => {
          // 3. 獲取圖片 URL
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(`public/${item.name}.jpg`);

          return (
            <div key={item.id} className="border p-4 rounded-lg shadow-sm">
              {/* 圖片部分 */}
              <img 
                src={data.publicUrl} 
                alt={item.name} 
                className="w-full h-48 object-cover mb-4 rounded-md" 
              />
              
              {/* 名稱部分 */}
              <h3 className="text-xl font-bold mb-4">{item.name}</h3>
              
              {/* 跳轉部分 */}
              <Link 
                href={`/accessories/${item.name}`} 
                className="block bg-black text-white text-center py-2 px-4 rounded hover:bg-gray-800 transition"
              >
                立即購買！
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}