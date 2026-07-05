// app/boards/page.tsx   2026-6-28 确保只按型号去重并显示三个型号，不会出现重复图片
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

// 定义明确的产品接口，消除类型警告
interface Product {
  id: string;
  name: string;
  category: string;
}

export default async function BoardsPage() {
  const supabase = await createClient();

  // 获取所有类别为 boards 的产品，先不过滤状态，确保列表数据完整
  const { data: allItems, error } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('category', 'boards');

  if (error || !allItems) {
    return <div className="p-10 text-center">无法加载产品列表</div>;
  }

  // 核心逻辑：按 name 字段去重，确保每个型号只显示一张卡片
  const uniqueItems = Array.from(
    new Map(allItems.map((item: Product) => [item.name, item])).values()
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">板类系列</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {uniqueItems.map((item: Product) => {
          // 获取图片 URL
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
                href={`/boards/${item.name}`} 
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