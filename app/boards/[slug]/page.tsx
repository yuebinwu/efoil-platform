// app/boards/[slug]/page.tsx   2026-6-28 調試成功--跳轉--填寫--成功
import { createClient } from '@/lib/supabase-server'; 
import Link from 'next/link';

export default async function BoardDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: boards, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug));

  if (error || !boards || boards.length === 0) {
    return <div className="p-10 text-center text-red-500">找不到產品或資料讀取錯誤</div>;
  }

  // 确保库存逻辑一致：只计算 available 状态的库存
  const totalAvailableQuantity = boards.reduce((sum, b) => {
    return b.status === 'available' ? sum + (b.quantity || 0) : sum;
  }, 0);

  const board = boards[0];
  const { data: imageData } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${board.name}.jpg`);

  return (
    <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img src={imageData.publicUrl} alt={board.name} className="w-full rounded-lg shadow-lg" />
      </div>

      <div className="flex flex-col">
        <h1 className="text-4xl font-bold mb-4">{board.name}</h1>
        <p className="text-gray-600 mb-6">{board.description || "暫無詳細描述"}</p>
        
        {/* 显示库存 */}
        <div className="text-xl mb-4 font-semibold text-gray-800">
           庫存數量: {totalAvailableQuantity > 0 ? totalAvailableQuantity : <span className="text-red-500">已售罄</span>}
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-6">
            價格: ${board.price || "請諮詢"}
        </div>
        
        {/* 统一改为跳转到 /checkout 页 */}
        {totalAvailableQuantity > 0 ? (
          <Link 
            href={`/checkout?product=${encodeURIComponent(board.name)}`} 
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-center"
          >
            立即購買
          </Link>
        ) : (
          <button disabled className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed">
            已售罄
          </button>
        )}
      </div>
    </div>
  );
}