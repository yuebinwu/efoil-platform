'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client'; 
import { useRouter } from 'next/navigation';

export default function Header() {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
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
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="flex justify-between items-center py-6 px-10 border-b border-gray-100 bg-white">
      <Link href="/" className="text-xl font-bold">Certmapsys E-FOIL</Link>
      <nav className="flex gap-6 text-sm font-medium">
        <Link href="/about">About</Link>
        <Link href="/boards">Board</Link>
        <Link href="/foils">Foil</Link>
        <Link href="/motors">Electric</Link>
        <Link href="/batteries">Battery</Link>
        <Link href="/accessories">Accessory</Link>
      </nav>
      <div className="flex items-center gap-4 text-sm font-medium">
        {isLoggedIn === null ? <div className="w-20" /> : isLoggedIn ? (
          <>
            <Link href="/dashboard" className="text-black font-bold border-b-2 border-black">Dashboard</Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition">Sign out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-500">Login</Link>
            <Link href="/register" className="hover:text-gray-500">Register</Link>
          </>
        )}
        <Link href="/cart" className="bg-black text-white px-5 py-2 rounded-full">Shop</Link>
      </div>
    </header>
  );
}