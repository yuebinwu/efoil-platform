"use client";
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function UserBadge() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('guest'); // 預設值
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        // 假設您的 user table 有 role 欄位
        supabase.from('profiles').select('role').eq('id', data.user.id).single().then(({ data: profile }) => {
          if (profile) setRole(profile.role);
        });
      }
      setLoading(false);
    });
  }, []);

  // 不再 return null，而是顯示佔位符，確保導航區塊結構完整
  if (loading) return <div className="p-2 text-sm text-gray-300 animate-pulse">載入中...</div>;
  if (!user) return <div className="p-2 text-sm text-red-400">未登入</div>;

  return (
    <div className="pt-2">
      <div className="text-xs text-gray-400 mb-1">當前帳號</div>
      <div className="text-sm font-medium text-gray-700 mb-2 truncate">{user.email}</div>
      <div className="px-2 py-0.5 bg-gray-900 text-white rounded text-[10px] font-bold uppercase inline-block">
        {role}
      </div>
    </div>
  );
}