// lib/auth-utils.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getUserRole() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      },
    }
  );
  
  // 1. 先確認是否有登入用戶
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.log("【除錯】 getUserRole: 未發現登入用戶");
    return null;
  }

  // 2. 查詢 profiles 表 (關鍵檢查點)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role') // 確認你的表欄位名稱確實是 'role'
    .eq('id', user.id) // 確認你的 profiles 表是用 'id' 來對應 auth.users
    .single();

  if (profileError) {
    console.log("【除錯】 profiles 查詢失敗，錯誤訊息:", profileError);
    return null;
  }

  console.log("【除錯】 成功獲取到角色資料:", profile);
  return profile.role; 
}