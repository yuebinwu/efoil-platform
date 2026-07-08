import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

interface Product {
  id: string;
  name: string;
  category: string;
}

// 确保页面实时获取数据库数据，禁止缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BoardsPage() {
  const supabase = await createClient();

  const { data: allItems, error } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('category', 'boards');

  if (error || !allItems) {
    return <div className="p-10 text-center text-red-500">无法加载板类列表</div>;
  }

  // 严格按 name 去重
  const uniqueItemsMap = new Map<string, Product>();
  allItems.forEach((item: Product) => {
    if (!uniqueItemsMap.has(item.name)) {
      uniqueItemsMap.set(item.name, item);
    }
  });
  const uniqueItems = Array.from(uniqueItemsMap.values());

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">板类系列</h1>
      
      {/* 调整布局为响应式 4 列网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueItems.map((item: Product) => {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(`public/${item.name}.jpg`);

          return (
            <div key={item.id} className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col bg-white">
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <ProductImage src={data.publicUrl} alt={item.name} />
              </div>
              
              <h3 className="text-lg font-semibold mb-4 truncate">{item.name}</h3>
              
              <Link 
                href={`/boards/${item.name}`} 
                className="mt-auto w-full bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition"
              >
                查看詳情
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}