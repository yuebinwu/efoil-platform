'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
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
      {/* --- Sidebar Area --- */}
      <aside className="w-64 p-4 border-r">
        <div className="mb-6 p-4 bg-gray-100 rounded">
          {user ? (
            <>
              <p className="font-bold text-sm">Account</p>
              <p className="text-lg truncate">{user.email}</p>
              <span className="inline-block bg-black text-white text-xs px-2 py-1 mt-2">
                CUSTOMER
              </span>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Other sidebar menu items... */}
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard</h1>
        <p className="text-gray-600">Please use the Sign Out button to securely exit your session.</p>
      </main>
    </div>
  );
}