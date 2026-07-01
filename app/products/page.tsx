import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

// 定義儲存庫基礎路徑
const STORAGE_BASE_URL = "https://oijpaxmhtdzuiopfkpwz.supabase.co/storage/v1/object/public/product-images/public";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  // 1. 初始化 Supabase
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // 2. 從資料庫獲取單一產品
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 圖片展示區 */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={`${STORAGE_BASE_URL}/${product.slug}.jpg`} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // 簡單的防錯，若圖片載入失敗顯示預設圖
              e.currentTarget.src = '/default-product.jpg';
            }}
          />
        </div>

        {/* 產品資訊區 */}
        <div>
          <p className="text-gray-600 mb-4 text-lg">{product.description || '專業裝備，提升你的水上飛行體驗。'}</p>
          <div className="text-3xl font-bold text-black mb-8">
            ${product.price}
          </div>

          {/* 導向至真正的結帳頁面 */}
          <form action="/checkout" method="GET">
            <input type="hidden" name="product" value={product.slug} />
            <button 
              type="submit" 
              className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg"
            >
              立即購買
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}