'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

interface OrderItem {
  name: string;
}

interface Order {
  id: string;
  uid: string;
  user_id: string;
  unit_price: number;
  quantity: number;
  created_at: string;
  status: 'pending' | 'sold';
  items?: OrderItem[] | OrderItem;
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('orders')
        .select(`id, uid, user_id, unit_price, quantity, created_at, status, items`)
        .order('status', { ascending: true });

      if (error) {
        console.error("Error loading orders:", error);
        return;
      }
      if (data) setOrders(data as Order[]);
    }
    fetchData();
  }, [supabase]);

  const getProductName = (items: Order['items']): string => {
    if (!items) return '';
    return Array.isArray(items) ? (items[0]?.name ?? '') : (items.name ?? '');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders & Ownership</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">Unique UID</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Purchase Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Details</th>
            <th className="border p-2">Transfer</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id.slice(0, 8)}</td>
              <td className="border p-2">{getProductName(order.items)}</td>
              <td className="border p-2 text-blue-600">{order.uid}</td>
              <td className="border p-2">${order.unit_price}</td>
              <td className="border p-2">{order.quantity}</td>
              <td className="border p-2">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="border p-2 text-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'sold' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {order.status}
                </span>
              </td>
              <td className="border p-2 text-blue-600 cursor-pointer text-center">Details</td>
              <td className="border p-2 text-center">
                {order.status === 'pending' ? (
                  <Link href={`/dashboard/orders/transfer/${order.id}`} className="text-blue-600 hover:underline text-sm">
                    Transfer Ownership
                  </Link>
                ) : (
                  <span className="text-gray-400 text-sm">Transferred</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}