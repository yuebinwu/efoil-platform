'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// 1. 定义强类型接口，严格对应数据库字段
interface Transfer {
  id: string;
  assignee_name: string;
  assignee_phone: string;
  assignee_address: string;
  product_name: string;
  uid: string;
  price: number;
  quantity: number;
  package_status: string;
  created_at: string;
}

export default function TransferBillPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('transfers')
        .select(`
          id, assignee_name, assignee_phone, assignee_address, 
          product_name, uid, price, quantity, package_status, created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading transfer records:", error);
        return;
      }

      if (data) {
        setTransfers(data as Transfer[]);
      }
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Transfer of Ownership Management</h1>
      
      <table className="w-full border-collapse border border-gray-200 text-xs">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2">Assignee Name</th>
            <th className="border p-2">Assignee Phone</th>
            <th className="border p-2">Assignee Address</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">UID</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="border p-2">{t.assignee_name}</td>
              <td className="border p-2">{t.assignee_phone}</td>
              <td className="border p-2">{t.assignee_address}</td>
              <td className="border p-2 font-bold">{t.product_name}</td>
              <td className="border p-2 font-mono text-blue-600">{t.uid}</td>
              <td className="border p-2">${t.price}</td>
              <td className="border p-2">{t.quantity}</td>
              <td className="border p-2">{t.package_status}</td>
              <td className="border p-2 text-center">
                <button 
                  type="button"
                  onClick={() => window.open(`/print-center?id=${t.id}&type=transfer`, '_blank')}
                  className="bg-black text-white px-3 py-1 rounded font-bold hover:bg-gray-800 transition-colors"
                >
                  Print Certificate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}