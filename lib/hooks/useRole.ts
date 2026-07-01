// lib/hooks/useUserRole.ts
'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('role').eq('id', user.id).single()
          .then(({ data }) => setRole(data?.role || 'user'));
      }
    });
  }, []);
  return role;
}