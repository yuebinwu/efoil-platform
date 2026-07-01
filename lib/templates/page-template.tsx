// lib/templates/page-template.tsx
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

// 關鍵點：一定要有 export
export async function renderProductList(category: string) {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items?.map((item) => (
        <div key={item.id} className="border p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-4">{item.name}</h3>
          <Link 
            href={`/${category}/${item.name}`} 
            className="block bg-black text-white text-center py-2 px-4 rounded"
          >
            立即購買
          </Link>
        </div>
      ))}
    </div>
  );
}