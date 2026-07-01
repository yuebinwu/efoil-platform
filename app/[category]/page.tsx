import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  // 撈取該分類下的所有產品
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', params.category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products?.map((p) => (
        <div key={p.id} className="border p-4">
          <img src={p.image_url} alt={p.name} />
          <h3>{p.name}</h3>
          <Link href={`/${p.category}/${p.slug}`}>
          </Link>
        </div>
      ))}
    </div>
  );
}