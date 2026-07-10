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
  unit_price: number;
  quantity: number;
  created_at: string;
  items?: OrderItem[] | OrderItem;
}

export default function RepairsDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('orders')
        .select('id, uid, unit_price, quantity, created_at, items')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading data:", error);
        return;
      }

      if (data) setOrders(data as Order[]);
    }
    fetchData();
  }, [supabase]);

  const getProductName = (items: Order['items']): string => {
    if (!items) return 'Standard Product';
    return Array.isArray(items) ? (items[0]?.name ?? '') : (items.name ?? '');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Center</h1>
        <Link href="/dashboard/repairs/query" className="text-sm font-bold text-blue-600 hover:underline">
          Service History →
        </Link>
      </div>
      
      <table className="w-full border-collapse border border-gray-200 bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-3 text-left">Product Name</th>
            <th className="border p-3 text-left">Unique UID</th>
            <th className="border p-3 text-left">Price</th>
            <th className="border p-3 text-left">Quantity</th>
            <th className="border p-3 text-left">Purchase Date</th>
            <th className="border p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border p-3">{getProductName(order.items)}</td>
              <td className="border p-3 font-mono text-gray-600">{order.uid}</td>
              <td className="border p-3">${order.unit_price}</td>
              <td className="border p-3">{order.quantity}</td>
              <td className="border p-3">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="border p-3 text-center">
                <Link 
                  href={`/dashboard/repairs/request?order_id=${order.id}`} 
                  className="bg-black text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-gray-800"
                >
                  Request Service
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}