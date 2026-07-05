'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function ReplyPage() {
  const router = useRouter();
  const params = useParams();
  const messageId = params.id as string;
  
  const [userEmail, setUserEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 获取当前登录用户邮箱
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      }
    };
    fetchUser();
  }, [supabase]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("回复内容不能为空！");
      return;
    }

    setLoading(true);

    // 提交回复到 message_replies 表，绑定 replied_by 为当前登录邮箱
    const { error } = await supabase
      .from('message_replies')
      .insert([{ 
        message_id: messageId, 
        content: content,
        replied_by: userEmail // 自动绑定登录者的邮箱
      }]);

    setLoading(false);

    if (error) {
      console.error('回复失败:', error);
      alert(`回复失败: ${error.message}`);
    } else {
      router.push('/dashboard/messages');
      router.refresh();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">填写回复</h1>
      
      <div className="mb-4">
        <label className="block font-bold mb-2">回复人</label>
        <input 
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          value={userEmail}
          readOnly // 锁定回复人，防止篡改
        />
      </div>
      
      <div className="mb-6">
        <label className="block font-bold mb-2">内容</label>
        <textarea 
          className="w-full p-4 border rounded" 
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入回复内容..."
        />
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '提交中...' : '提交回复'}
        </button>
        <button 
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-300"
        >
          取消
        </button>
      </div>
    </div>
  );
}