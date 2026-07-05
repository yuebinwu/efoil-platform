'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

interface SupabaseMessage {
  id: string;
  title: string;
  user_name: string;
  message_replies: { count: number }[];
}

interface Message {
  id: string;
  title: string;
  user_name: string;
  reply_count: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [canReply, setCanReply] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchMessages = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role?.toLowerCase();
    setCanReply(['owner', 'business', 'technician'].includes(role));

    const { data } = await supabase
      .from('messages')
      .select('id, title, user_name, message_replies(count)')
      .order('created_at', { ascending: false });

    if (data) {
      const formatted = (data as SupabaseMessage[]).map((msg) => ({
        id: msg.id,
        title: msg.title,
        user_name: msg.user_name,
        reply_count: msg.message_replies?.[0]?.count || 0
      }));
      setMessages(formatted);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">留言板</h1>
        <Link href="/dashboard/messages/new" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">
          提交新问题
        </Link>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <div className="grid grid-cols-8 p-4 border-b font-bold text-gray-500 text-sm uppercase">
          <div className="col-span-3">主题 (SUBJECT)</div>
          <div className="col-span-2">用户</div>
          <div className="col-span-1">状态</div>
          {canReply && <div className="col-span-1 text-center">回复</div>}
          <div className="col-span-1 text-center">查询</div>
        </div>

        {/* 使用了 messages 变量 */}
        {messages.map((msg) => (
          <div key={msg.id} className="grid grid-cols-8 p-4 border-b items-center hover:bg-gray-50">
            <div className="col-span-3 font-semibold text-gray-900">{msg.title}</div>
            <div className="col-span-2 text-gray-600 text-sm">{msg.user_name || '匿名'}</div>
            <div className="col-span-1">
              <span className={`px-2 py-1 rounded text-xs font-bold ${msg.reply_count > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {msg.reply_count > 0 ? `已回复 (${msg.reply_count})` : '待处理'}
              </span>
            </div>
            {/* 使用了 canReply 变量 */}
            {canReply && (
              <div className="col-span-1 text-center">
                <Link href={`/dashboard/messages/${msg.id}/reply`} className="text-blue-600 font-bold hover:underline">填写回复</Link>
              </div>
            )}
            <div className="col-span-1 text-center">
              <Link href={`/dashboard/messages/${msg.id}`} className="text-gray-600 font-bold hover:underline">查询详细</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}