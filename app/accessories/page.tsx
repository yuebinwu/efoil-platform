import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

interface Accessory {
  id: string;
  name: string;
  category: string;
}

// 强制页面不缓存，每次请求都动态计算
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AccessoriesPage() {
  const supabase = await createClient();

  // 1. 获取数据：明确查询
  const { data: allItems, error } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('category', 'accessories');

  console.log("查询到的原始数据:", allItems);

  if (error) {
    console.error("Supabase 查询错误:", error);
    return <div className="p-10 text-center text-red-500">加载失败</div>;
  }

  // 2. 严谨去重
  const uniqueItems = allItems ? Array.from(
    new Map(allItems.map((item: Accessory) => [item.name, item])).values()
  ) : [];

  // 调试日志：打开终端查看输出是否与数据库一致
  console.log("当前渲染配件总数:", uniqueItems.length);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">配件系列 (当前共 {uniqueItems.length} 个)</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueItems.map((item: Accessory) => {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(`public/${item.name}.jpg`);

          return (
            <div key={item.id} className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white flex flex-col">
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <ProductImage src={data.publicUrl} alt={item.name} />
              </div>
              <h3 className="text-lg font-semibold mb-4 truncate">{item.name}</h3>
              <Link 
                href={`/accessories/${item.name}`} 
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