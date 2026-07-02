import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function FoilDetailPage({ params }: { params: { slug: string } }) {
  // 這裡的 slug 就是從網址接收到的 item.name
  const { slug } = params;

  // 1. 查詢邏輯：確保使用 name 欄位匹配網址傳來的 slug
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug)) 
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10">{product.name}</h1>
      
      {/* 佈局：Flex 結構，圖片左，說明右 */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* 左側：圖片 */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>

        {/* 右側：說明與價格 */}
        <div className="w-full md:w-1/2 flex flex-col pt-2">
          <h2 className="text-2xl font-semibold mb-4">產品說明</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {product.description || "此產品暫無詳細說明。"}
          </p>
          
          <div className="mt-auto">
            <p className="text-4xl font-bold text-black mb-8">${product.price}</p>
            
            <Link 
              href={`/checkout?product=${encodeURIComponent(product.name)}`}
              className="block w-full md:w-auto text-center bg-black text-white px-10 py-4 rounded-lg hover:bg-gray-800 transition shadow-lg text-lg"
            >
              立即購買
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}