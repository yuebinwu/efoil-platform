// app/batteries/[slug]/page.tsx
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function BatteryDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: batteries, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug));

  if (error || !batteries || batteries.length === 0) {
    return <div className="p-10 text-center text-red-500">No description available / Error loading details</div>;
  }

  // 统一库存逻辑：只计算 available 状态的库存
  const totalAvailableQuantity = batteries.reduce((sum, b) => {
    return b.status === 'available' ? sum + (b.quantity || 0) : sum;
  }, 0);

  const battery = batteries[0];
  const { data: imageData } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${battery.name}.jpg`);

  return (
    <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img src={imageData.publicUrl} alt={battery.name} className="w-full rounded-lg shadow-lg" />
      </div>

      <div className="flex flex-col">
        <h1 className="text-4xl font-bold mb-4">{battery.name}</h1>
        <p className="text-gray-600 mb-6">{battery.description || "No description available"}</p>
        
        {/* 显示库存 */}
        <div className="text-xl mb-4 font-semibold text-gray-800">
            Stock: {totalAvailableQuantity > 0 ? totalAvailableQuantity : <span className="text-red-500">Out of stock</span>}
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-6">
            Price: ${battery.price || " Contact us"}
        </div>
        
        {/* 购买按钮逻辑 */}
        {totalAvailableQuantity > 0 ? (
          <Link 
            href={`/checkout?product=${encodeURIComponent(battery.name)}`} 
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