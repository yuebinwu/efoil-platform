'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

// 定义从 orders 表获取的订单数据接口
interface Order {
  id: string;
  uid: string | null;
}

export default function RequestRepairPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 获取用户已购买的订单，限定只查询需要的字段
      const { data } = await supabase
        .from('orders')
        .select('id, uid')
        .eq('user_id', user.id);

      if (data) {
        setOrders(data as Order[]);
      }
    };
    fetchOrders();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please sign in to submit a request.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('repairs').insert({
      user_id: user.id,
      order_id: formData.get('order_id') as string,
      product_name: formData.get('product_name') as string,
      uid: formData.get('uid') as string,
      description: formData.get('description') as string,
      status: 'pending'
    });

    if (error) {
      alert("Submission failed: " + error.message);
    } else {
      alert("Service request submitted successfully!");
      router.push('/dashboard/repairs/query');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">New Service Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Select Product</label>
          <select name="order_id" required className="w-full p-2 border rounded">
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id.slice(0, 8)} - {o.uid || 'No UID'}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Product Name</label>
          <input name="product_name" required className="w-full p-2 border rounded" placeholder="e.g. Board Cruiser" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">UID</label>
          <input name="uid" required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Issue Description</label>
          <textarea name="description" required className="w-full p-2 border rounded h-32" placeholder="Please describe the issue..." />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition"
        >
          {loading ? 'Submitting...' : 'Submit Service Request'}
        </button>
      </form>
    </div>
  );
}