// app/page.tsx   2026-6-27 ok 從supabase/product-images/public/webpage.jpg修改成功
import { createClient } from '@/lib/supabase-server';

export default async function HomePage() {
  const supabase = await createClient();
  
  // 從 Supabase Storage 的 'images' bucket 獲取 'webpage.jpg' 的公開網址
  // 請確認你的 Storage Bucket 名稱為 'images' 且檔案名稱為 'webpage.jpg'
  const { data } = supabase.storage
    .from('product-images') 
    .getPublicUrl('public/web-page-v260611.jpg');

  const imageUrl = data.publicUrl;

  return (
    <div className="flex flex-col gap-12 py-8 px-4 max-w-6xl mx-auto">
            
      {/* 第一段：主視覺圖片 (現改為從 Supabase 讀取) */}
      <section className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
        <img 
          src={imageUrl} 
          alt="E-FOIL 主視覺" 
          className="w-full h-full object-cover" 
        />
      </section>

      {/* 第二段：文字說明 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">專業水上電動設備 E-FOIL</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          我們致力於提供高性能的 E-FOIL 設備，結合科技與海洋，讓您享受極致的飛行體驗。
        </p>
      </section>

      {/* 第三段：摺疊式問答區 */}
      <section className="bg-gray-50 p-8 rounded-xl border border-gray-100 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">常見問題</h2>
        <div className="space-y-4">
          
          <details className="group bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
              Q: 產品有保固嗎？
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 border-t pt-4">
              A: 我們提供全機一年保固，並提供專業售後團隊支援。
            </p>
          </details>

          <details className="group bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
              Q: 如何進行產權轉讓？
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 border-t pt-4">
              A: 請登入後前往「我的訂單」頁面，即可針對特定訂單發起數位轉讓申請。
            </p>
          </details>

        </div>
      </section>
      
    </div>
  );
}