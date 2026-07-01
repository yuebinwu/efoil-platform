// app/dashboard/admin/layout.tsx，所有用户操作基于dashboard   2026-6-28 調試成功--跳轉--填寫--成功
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: { 
        getAll() { return cookieStore.getAll(); } 
      } 
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 1. 若未登入，強制跳轉到登入頁
  if (!user) {
    redirect('/login');
  }

  // 2. 從資料庫撈取 role，而非寫死 Email
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // 3. 安全權限檢查：只有角色為 'owner' 才能進入管理後台
  // 如果不是 owner，一律強制導回會員總覽
  if (!profile || profile.role !== 'owner') {
    redirect('/dashboard');
  }

  return (
    <div className="admin-layout-wrapper">
      {children}
    </div>
  );
}