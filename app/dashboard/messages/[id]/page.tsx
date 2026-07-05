'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';

// 定义回复的结构
interface MessageReply {
  id: string;
  content: string;
  created_at: string;
}

// 定义留言的结构
interface Message {
  id: string;
  title: string;
  content: string;
  message_replies: MessageReply[];
}

export default function MessageDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  // 使用定义好的接口作为状态类型
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchMessage() {
      if (!id) return;
      
      const { data } = await supabase
        .from('messages')
        // 在关联查询中添加 order 规则，针对 foreignTable 'message_replies' 进行排序
        .select('*, message_replies(*)')
        .eq('id', id)
        .order('created_at', { ascending: false, foreignTable: 'message_replies' }) 
        .single();

      if (data) {
        setMessage(data as Message);
      }
      setLoading(false);
    }
    fetchMessage();
  }, [id, supabase]);

  if (loading) return <div className="p-8">加载中...</div>;
  if (!message) return <div className="p-8">未找到留言。</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{message.title}</h1>
      <div className="bg-white p-6 rounded border shadow-sm">
        <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
      </div>
      
      <h2 className="text-xl font-bold mt-8 mb-4">回复记录</h2>
      <div className="space-y-4">
        {message.message_replies?.map((reply: MessageReply) => (
          <div key={reply.id} className="p-4 bg-gray-50 rounded border">
            <p>{reply.content}</p>
            <span className="text-xs text-gray-500">
              {new Date(reply.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}