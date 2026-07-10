//2026-6-27  測試通過，統一產品表的name=slug  
// 改造后的配件详情页：直接集成下单功能
import { createClient } from '@/lib/supabase-server'; 
import Link from 'next/link';

export default async function AccessoryDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 获取所有同名配件，用于计算总库存
  const { data: items, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug));

  if (error || !items || items.length === 0) {
    return <div className="p-10 text-center text-red-500">Product not found / Failed to load</div>;
  }

  // 计算逻辑与板子页完全一致：只统计 available 的库存
  const totalAvailableQuantity = items.reduce((sum, item) => {
    return item.status === 'available' ? sum + (item.quantity || 0) : sum;
  }, 0);

  const item = items[0];
  const { data: imageData } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${item.name}.jpg`);

  return (
    <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img src={imageData.publicUrl} alt={item.name} className="w-full rounded-lg shadow-lg" />
      </div>

      <div className="flex flex-col">
        <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
        <p className="text-gray-600 mb-6">{item.description || "No description available"}</p>
        
        {/* 精准库存显示 */}
        <div className="text-xl mb-4 font-semibold text-gray-800">
           Stock: {totalAvailableQuantity > 0 ? totalAvailableQuantity : <span className="text-red-500">已售罄</span>}
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-6">
            Price: ${item.price || "Contact us for details"}
        </div>
        
        {/* 保持与板子页一致：跳转到 /checkout 页面进行下单 */}
        {totalAvailableQuantity > 0 ? (
          <Link 
            href={`/checkout?product=${encodeURIComponent(item.name)}`} 
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-center"
          >
            Buy Now
          </Link>
        ) : (
          <button disabled className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed">
            Out of stock
          </button>
        )}
      </div>
    </div>
  );
}