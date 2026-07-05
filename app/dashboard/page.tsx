//2026-7-3去掉三目计算，测试正常
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js'; // 导入 Supabase 的 User 类型

export default function DashboardPage() {
  // 使用 User 类型明确定义状态，初始值为 null
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  return (
    <div className="flex">
      {/* --- 左侧侧边栏区域 --- */}
      <aside className="w-64 p-4 border-r">
        <div className="mb-6 p-4 bg-gray-100 rounded">
          {user ? (
            <>
              <p className="font-bold text-sm">當前帳號</p>
              <p className="text-lg">{user.email}</p>
              <span className="inline-block bg-black text-white text-xs px-2 py-1 mt-2">
                CUSTOMER
              </span>
            </>
          ) : (
            <p>加载中...</p>
          )}
        </div>
        {/* 其他侧边栏菜单项... */}
      </aside>

      {/* --- 右侧主内容区域 --- */}
      <main className="flex-1 p-8">
        <h1>歡迎進入用戶中心</h1>
        <h1>请使用“登出”左键安全退出！</h1>
      </main>
    </div>
  );
}