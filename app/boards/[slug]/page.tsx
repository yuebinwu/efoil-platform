// app/boards/[slug]/page.tsx   2026-6-28 調試成功--跳轉--填寫--成功
import { createClient } from '@/lib/supabase-server'; 
import Link from 'next/link';
export default async function BoardDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. 資料獲取區 (結構清晰)
  const { data: board } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug))
    .single();

  if (!board) return <div>找不到產品</div>;

  // 2. 圖片處理 (獲取 Public URL)
  const { data: imageData } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${board.name}.jpg`);

  // 3. 渲染區 (結構清晰，容易維護)
  return (
    <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* 左側圖片區 */}
      <div>
        <img src={imageData.publicUrl} alt={board.name} className="w-full rounded-lg shadow-lg" />
      </div>

      {/* 右側資訊區 */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{board.name}</h1>
        <p className="text-gray-600 mb-6">{board.description || "暫無描述"}</p>
        <div className="text-2xl font-bold text-blue-600 mb-6">
            價格: ${board.price || "請諮詢"}
        </div>
          <Link 
            // 建議：使用 board.name 作為傳遞參數，這通常是資料庫中的唯一識別碼
            href={`/checkout?product=${encodeURIComponent(board.name)}`} 
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            立即購買
          </Link>
      </div>
    </div>
  );
}