'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.replace('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-8">Welcome back</h1>
      
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-black outline-none transition-colors" 
            placeholder="Enter your email" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-black outline-none transition-colors" 
              placeholder="Enter your password" 
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-5 text-gray-400 hover:text-black"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-black text-white rounded-2xl text-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}