'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // 導入眼睛圖標

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-8">{isLogin ? "歡迎回來" : "建立帳戶"}</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">用戶名稱</label>
          <input type="text" className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-black outline-none" placeholder="輸入名稱" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">密碼</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-black outline-none" 
              placeholder="輸入密碼" 
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

        <button className="w-full py-4 bg-black text-white rounded-2xl text-lg font-bold hover:bg-gray-800 transition">
          {isLogin ? "登入" : "註冊"}
        </button>

        <p className="text-center text-gray-500">
          {isLogin ? "還沒有帳戶？" : "已經有帳戶？"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-black font-bold underline">
            {isLogin ? "立即註冊" : "立即登入"}
          </button>
        </p>
      </div>
    </div>
  );
}