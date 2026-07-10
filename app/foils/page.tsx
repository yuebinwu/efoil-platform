import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

interface Product {
  id: string;
  name: string;
  category: string;
}

// 强制动态渲染，确保数据库更新后页面即时反映
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FoilsPage() {
  const supabase = await createClient();

  const { data: allItems, error } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('category', 'foils');

  if (error || !allItems) {
    return <div className="p-10 text-center text-red-500">Failed to load foils</div>;
  }

  // 严格按 name 去重，防止数据库冗余数据导致重复渲染
  const uniqueItemsMap = new Map<string, Product>();
  allItems.forEach((item: Product) => {
    if (!uniqueItemsMap.has(item.name)) {
      uniqueItemsMap.set(item.name, item);
    }
  });
  const uniqueItems = Array.from(uniqueItemsMap.values());

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Foils</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueItems.map((item: Product) => {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(`public/${item.name}.jpg`);

          return (
            <div key={item.id} className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col bg-white">
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                {/* 统一使用 ProductImage 组件 */}
                <ProductImage src={data.publicUrl} alt={item.name} />
              </div>
              
              <h3 className="text-lg font-semibold mb-4 truncate">{item.name}</h3>
              
              <Link 
                href={`/foils/${item.name}`} 
                className="mt-auto w-full bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Learn more
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}