// app/foils/[slug]/page.tsx
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function FoilDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. 获取数据：保持与 boards 逻辑一致
  const { data: foils, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug));

  if (error || !foils || foils.length === 0) {
    return <div className="p-10 text-center text-red-500">No description available / Error loading details</div>;
  }

  // 2. 统一库存逻辑：只计算 status 为 'available' 的数量
  const totalAvailableQuantity = foils.reduce((sum, f) => {
    return f.status === 'available' ? sum + (f.quantity || 0) : sum;
  }, 0);

  const foil = foils[0];

  // 3. 获取图片 URL
  const { data: imageData } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${foil.name}.jpg`);

  return (
    <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img src={imageData.publicUrl} alt={foil.name} className="w-full rounded-lg shadow-lg" />
      </div>

      <div className="flex flex-col">
        <h1 className="text-4xl font-bold mb-4">{foil.name}</h1>
        <p className="text-gray-600 mb-6">{foil.description || "Failed to load foils"}</p>
        
        {/* 库存显示：与 boards 保持一致 */}
        <div className="text-xl mb-4 font-semibold text-gray-800">
          Stock: {totalAvailableQuantity > 0 ? totalAvailableQuantity : <span className="text-red-500">Out of stock</span>}
        </div>

        {/* 价格显示：与 boards 保持一致 */}
        <div className="text-2xl font-bold text-blue-600 mb-6">
          Price: ${foil.price || " Contact us"}
        </div>
        
        {/* 购买按钮逻辑：与 boards 保持一致 */}
        {totalAvailableQuantity > 0 ? (
          <Link 
            href={`/checkout?product=${encodeURIComponent(foil.name)}`} 
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-center"
          >
            Buy now
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