'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function NewMessagePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("标题和内容不能为空！");
      return;
    }

    setLoading(true);

    // 1. 获取当前登录用户，确保提交时一定有用户信息
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("请先登录！");
      setLoading(false);
      return;
    }

    // 2. 插入数据，强制绑定 user_id 和 user_name
    const { error } = await supabase
      .from('messages')
      .insert([{ 
        title, 
        content,
        user_id: user.id,          // 绑定用户 ID
        user_name: user.email      // 绑定登录邮箱
      }]);

    setLoading(false);

    if (error) {
      console.error('提交失败:', error);
      alert(`提交失败: ${error.message}`);
    } else {
      // 提交成功后跳转回列表页
      router.push('/dashboard/messages');
      router.refresh();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">提交新问题</h1>
      <div className="mb-4">
        <label className="block font-bold mb-2">标题</label>
        <input 
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入问题标题"
        />
      </div>
      <div className="mb-6">
        <label className="block font-bold mb-2">详细内容</label>
        <textarea 
          className="w-full p-4 border rounded" 
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入详细问题描述"
        />
      </div>
      <div className="flex gap-4">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '提交中...' : '发布留言'}
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