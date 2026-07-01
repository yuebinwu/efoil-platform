import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function DocumentsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">技術文件</h1>

      {/* 1. 用戶資訊區塊 (保持一致性) */}
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-2">個人資料</h2>
        <p><strong>姓名:</strong> {user?.user_metadata?.full_name || '用戶'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* 2. 技術文件清單 */}
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="font-bold text-xl mb-4">設備手冊與技術文件</h2>
        <p className="text-gray-600 mb-6">您可以在此下載與您的設備相關的技術文件。</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
            <span>E-Foil Cruiser V2 使用者指南</span>
            <button className="text-blue-600 font-bold hover:underline">下載 PDF</button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
            <span>High-Performance Battery 維護與安全手冊</span>
            <button className="text-blue-600 font-bold hover:underline">下載 PDF</button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
            <span>Standard Mast 安裝規格書</span>
            <button className="text-blue-600 font-bold hover:underline">下載 PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}