import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

// 定义订单项接口
interface OrderItem {
  name: string;
  unit_price?: number;
  price?: number;
}

// 定义订单接口
interface Order {
  id: string;
  items: string | OrderItem[];
  uid?: string;
  quantity?: number;
  created_at: string;
  status?: string;
}

export default async function OwnershipPage() {
  const supabase = createClient();

  // 指定泛型 <Order[]>
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div className="p-10 text-red-500">Error: {error.message}</div>;
  if (!orders) return null;

  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-6">Certificate of Ownership Management</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Unique UID</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Purchase Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {(orders as Order[]).map((order) => {
              // 提取 item 数据
              let item: OrderItem = { name: 'N/A' };
              try {
                const parsed = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                item = Array.isArray(parsed) ? parsed[0] : parsed;
              } catch (e) {
                console.error("Parse error:", e);
              }
              
              const price = item?.unit_price || item?.price || 0;

              return (
                <tr key={order.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{order.id.slice(0, 8)}</td>
                  <td className="border p-2 font-medium text-blue-700">{item.name}</td>
                  <td className="border p-2">{order.uid || '-'}</td>
                  <td className="border p-2">${Number(price).toLocaleString()}</td>
                  <td className="border p-2">{order.quantity || 1}</td>
                  <td className="border p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="border p-2 capitalize">{order.status || 'pending'}</td>
                  <td className="border p-2">
                    <Link 
                      href={`/print-center?id=${order.id}&type=ownership`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition"
                    >
                      Print Certificate
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}