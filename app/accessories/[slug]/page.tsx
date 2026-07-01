//2026-6-27  測試通過，統一產品表的name=slug  
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BoardDetailPage({ params }: { params: { slug: string } }) {
  // 1. 根據 URL 的 slug (產品名稱) 撈取資料
  const { data: accessories, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', params.slug)
    .single();

  if (error || !accessories) {
    notFound();
  }

  // 2. 嚴格從 Storage 取圖 (只引用您提供的黃金路徑格式)
  // 此處使用 params.slug，直接對應到 Storage 中的檔案名稱
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${params.slug}.jpg`);
<h1 className="text-3xl font-bold mb-8">專業水上板系列</h1>
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {/* 直接由 Storage 產生的精準網址，顯示圖片 */}
          <img 
            src={data.publicUrl} 
            alt={accessories.name} 
            className="w-full rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-6">{accessories.name}</h1>
          <p className="text-2xl text-gray-700 mb-8">${accessories.price}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">{accessories.description}</p>
          <Link 
            href={`/checkout?product=${encodeURIComponent(accessories.name)}`}
            className="block w-full bg-black text-white text-center py-4 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            立即購買
          </Link>
        </div>
      </div>
    </div>
  );
}