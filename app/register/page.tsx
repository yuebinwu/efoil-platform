'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react'; // 推荐使用 lucide-react 图标，更专业

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) { 
      alert(error.message); 
      setLoading(false); 
      return; 
    }
    
    if (data.user) {
      const { error: pError } = await supabase.from('profiles').upsert({ id: data.user.id, email });
      if (pError) alert("Profile creation failed: " + pError.message);
      else router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 border rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-3 border rounded-lg"
          />
          
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-3 border rounded-lg pr-12"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}