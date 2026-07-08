'use client';
import React from 'react';
import DocumentHeader from '../DocumentHeader';

// ==========================================
// 1. 类型定义
// ==========================================
export interface InvoiceItem {
  name: string;
  unit_price: number;
  description?: string;
  uid?: string;
}

export interface ProfileData {
  full_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  remarks?: string;
}

export interface InvoiceData {
  id: string;
  created_at: string;
  unit_price: string;
  items: InvoiceItem[] | string;
  profiles?: ProfileData;
}


// ==========================================
// 2. 组件主体
// ==========================================
export default function InvoiceTemplate({ data }: { data: InvoiceData }) {
  console.log("【核心排查】InvoiceTemplate 接收到的完整 data 对象:", data);
  console.log("【核心排查】data.items 的内容:", data.items);
  // 稳健的数据解析逻辑
  // 针对 image_deedff.png 中的 jsonb 结构进行彻底解析
  let itemsArray: InvoiceItem[] = [];
  try {
    if (data.items) {
      // 如果是字符串，解析它；如果是对象/数组，直接使用
      const parsed = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
      // 确保结果一定是数组
      itemsArray = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch (e) {
    console.error("数据解析错误:", e);
    itemsArray = [];
  }

  // 财务计算：确保只累加有效的 unit_price
  const subtotal = itemsArray.reduce((acc: number, item: InvoiceItem) => {
    return acc + Number(item.unit_price || 0);
  }, 0);
  
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;
  const p = data.profiles || {}; 

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      <DocumentHeader title="INVOICE" refNumber={data.id?.slice(0, 8) || 'N/A'} />
      
      <div className="mb-10 mt-8">
        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">BILL TO</h3>
        <div className="text-lg space-y-1">
          <p className="font-bold">{p.full_name || 'Valued Customer'}</p>
          <p>
            {p.street_address 
              ? `${p.street_address}, ${p.city || ''}, ${p.state || ''} ${p.postal_code || ''}` 
              : 'Address not provided'}
          </p>
          <p className="text-sm text-gray-600">Tel: {p.phone || 'N/A'}</p>
          {p.remarks && (
            <p className="text-sm italic text-gray-500 mt-2">Remarks: {p.remarks}</p>
          )}
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="py-2">Product Name</th>
            <th className="py-2">Description</th>
            <th className="py-2">UID</th>
            <th className="py-2 text-right">Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {itemsArray.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-3 font-medium">{item.name || 'N/A'}</td>
              <td className="py-3 text-gray-600">{item.description || '-'}</td>
              <td className="py-3 font-mono text-sm">{item.uid || '-'}</td>
              <td className="py-3 text-right">
                ${Number(item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-right">
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>Tax (8%): ${tax.toFixed(2)}</div>
          <p className="text-xl font-bold border-t border-black pt-2">Total: ${grandTotal.toFixed(2)}</p>
        </div>
      </div>

      <button 
        onClick={() => window.print()} 
        className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded font-bold hover:bg-gray-800"
      >
        Print Invoice
      </button>
    </div>
  );
}