"use client";

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js'; // 明确导入 User 类型

export default function UserBadge() {
  const [user, setUser] = useState<User | null>(null); // 使用 User 类型
  const [role, setRole] = useState<string>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        supabase.from('profiles').select('role').eq('id', data.user.id).single().then(({ data: profile }) => {
          if (profile) setRole(profile.role);
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-2 text-sm text-gray-300 animate-pulse">Loading...</div>;
  if (!user) return <div className="p-2 text-sm text-red-400">Not signed in</div>;

return (
    <div className="pt-2">
      {/* 调整后的样式：与下方导航栏标题完全统一 */}
      <div className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
        Current account
      </div>
      <div className="text-sm font-medium text-gray-700 mb-2 truncate">{user.email}</div>
      <div className="px-2 py-0.5 bg-gray-900 text-white rounded text-[10px] font-bold uppercase inline-block">
        {role}
      </div>
    </div>
  );
}