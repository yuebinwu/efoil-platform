import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

// 這裡不需要 export，這只是一個範本
async function DetailTemplate({ slug, category }: { slug: string, category: string }) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug))
    .single();

  if (!item) return <div>找不到產品</div>;

  return (
    <div className="max-w-4xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
        <p className="text-gray-600 mb-6">{item.description || "產品說明更新中..."}</p>
        <div className="text-2xl font-bold text-blue-600 mb-6">
          價格: ${item.price || "請洽詢"}
        </div>
        <Link 
          href={`/checkout?product=${encodeURIComponent(item.name)}`}
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          立即購買
        </Link>
      </div>
    </div>
  );
}