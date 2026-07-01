'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
// 1. 這裡必須改為引進 client 版本的 supabase
import { createClient } from '@/lib/supabase-client'; 
import { useRouter } from 'next/navigation';

export default function Header() {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  // 2. 初始化 client 端客戶端
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, [supabase]); // 加入依賴項

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // ... (下方 JSX 保持不變)
  return (
    <header className="flex justify-between items-center py-6 px-10 border-b border-gray-100 bg-white">
      <Link href="/" className="text-xl font-bold">E-FOIL</Link>
      <nav className="flex gap-6 text-sm font-medium">
        <Link href="/about">關於我們</Link>
        <Link href="/boards">板類</Link>
        <Link href="/foils">水翼</Link>
        <Link href="/motors">電機</Link>
        <Link href="/batteries">電池系統</Link>
        <Link href="/accessories">配件</Link>
      </nav>
      <div className="flex items-center gap-4 text-sm font-medium">
        {isLoggedIn === null ? <div className="w-20" /> : isLoggedIn ? (
          <>
            <Link href="/dashboard" className="text-black font-bold border-b-2 border-black">會員中心</Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition">登出</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-500">登入</Link>
            <Link href="/register" className="hover:text-gray-500">用戶註冊</Link>
          </>
        )}
        <Link href="/cart" className="bg-black text-white px-5 py-2 rounded-full">購物車</Link>
      </div>
    </header>
  );
}