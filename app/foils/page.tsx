// 2026-6-30 調試版本：確保 Link 與查詢欄位一致
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function FoilsPage() {
  const supabase = await createClient();

  // 1. 從 Supabase 獲取所有 foils 類別的產品
  const { data: items } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'foils');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">專業水翼系列</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items?.map((item) => {
          // 確保圖片獲取邏輯一致
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(`public/${item.name}.jpg`);

          return (
            <div key={item.id} className="border p-4 rounded-lg shadow-sm">
              <img 
                src={data.publicUrl} 
                alt={item.name} 
                className="w-full h-48 object-cover mb-4 rounded-md" 
              />
              
              <h3 className="text-xl font-bold mb-4">{item.name}</h3>
              
              {/* 核心修正點：
                  這裡確保 href 使用 item.name，且與 [slug]/page.tsx 的查詢條件 .eq('name', slug) 完全一致。
                  如果 boards 的邏輯是用 slug 欄位，建議這裡也統一使用 item.name (若 name 欄位確實存放了 URL 名稱)。
              */}
              <Link 
                href={`/foils/${encodeURIComponent(item.name)}`} 
                className="block bg-black text-white text-center py-2 px-4 rounded hover:bg-gray-800 transition"
              >
                立即購買
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}