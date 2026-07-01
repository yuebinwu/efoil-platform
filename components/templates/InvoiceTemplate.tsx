'use client';
import React from 'react';
import DocumentHeader from '../DocumentHeader'; // 使用統一的 Header 模板

export default function InvoiceTemplate({ data }: { data: any }) {
  // --- 數據安全解析邏輯 ---
  let itemsArray: any[] = [];
  try {
    const rawItems = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    itemsArray = Array.isArray(rawItems) ? rawItems : (rawItems ? [rawItems] : []);
  } catch (e) {
    itemsArray = [];
  }

  // --- 計算邏輯 ---
  const subtotal = itemsArray.reduce((acc: number, item: any) => 
    acc + (Number(item.price || item.unit_price || 0)), 0
  );
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      {/* 使用統一的 DocumentHeader */}
      <DocumentHeader title="發票 (INVOICE)" refNumber={data.id?.slice(0, 8) || 'INV-N/A'} />
      
      <div className="my-10">
        <h3 className="text-sm text-gray-500 uppercase tracking-widest font-bold">Bill To</h3>
        <p className="text-xl font-semibold">{data.customerName || 'Valued Customer'}</p>
      </div>

      <table className="w-full text-left border-collapse my-8">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-3 text-xs uppercase">產品名稱</th>
            <th className="py-3 text-xs uppercase">型號</th>
            <th className="py-3 text-xs uppercase">UID</th>
            <th className="py-3 text-right text-xs uppercase">數量 / 單價</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {itemsArray.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="py-4">{item.name || 'Product'}</td>
              <td className="py-4">{item.model || '-'}</td>
              <td className="py-4 font-mono text-sm">{item.uid || '-'}</td>
              <td className="py-4 text-right">1 x ${Number(item.price || 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-8">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between border-t-2 border-black pt-2 text-lg font-bold">
            <span>Total</span><span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button onClick={() => window.print()} className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded w-full">
        打印發票
      </button>
    </div>
  );
}