//2026-6-27 改爲從storage取圖，Gemini狗屎
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

interface Accessory {
  id: string;
  name: string;
  category: string;
}

export default async function AccessoriesPage() {
  const supabase = await createClient();

  const { data: allItems, error } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('category', 'accessories');

  if (error || !allItems) {
    return <div className="p-10 text-center">无法加载配件列表</div>;
  }

  // 严格按 name 去重，确保每个配件只显示一张图
  const uniqueItems = Array.from(
    new Map(allItems.map((item: Accessory) => [item.name, item])).values()
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">配件系列</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {uniqueItems.map((item: Accessory) => {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(`public/${item.name}.jpg`);

          return (
            <div key={item.id} className="border p-4 rounded-lg shadow-sm flex flex-col">
              <img 
                src={data.publicUrl} 
                alt={item.name} 
                className="w-full h-48 object-cover mb-4 rounded-md" 
              />
              <h3 className="text-xl font-bold mb-4">{item.name}</h3>
              
              <Link 
                href={`/accessories/${item.name}`} 
                className="block bg-black text-white text-center py-2 px-4 rounded hover:bg-gray-800 transition mt-auto"
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