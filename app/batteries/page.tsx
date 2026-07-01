import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function BatteriesPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'batteries');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">專業電池系統</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items?.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-sm">
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full h-48 object-cover mb-4 rounded-md" 
            />
            <h3 className="text-xl font-bold mb-4">{item.name}</h3>
            {/* 導向詳細頁的正確連結 */}
            <Link 
              href={`/batteries/${encodeURIComponent(item.name)}`} 
              className="block bg-black text-white text-center py-2 px-4 rounded hover:bg-gray-800 transition"
            >
              查看詳情
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}