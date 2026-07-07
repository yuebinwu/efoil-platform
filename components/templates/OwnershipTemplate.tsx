'use client';

import DocumentHeader from '../DocumentHeader';

export interface ItemData {
  name?: string;
  product_name?: string;
  description?: string;
  uid?: string;
  unit_price?: number; // 确保包含价格字段
  price?: number;
}

export interface OwnershipData {
  id: string;
  uid?: string;
  price?: number;
  created_at: string;
  items: ItemData | ItemData[] | string;
  user_info?: {
    userName?: string;
  };
}

interface Props {
  data: OwnershipData;
}

export default function OwnershipTemplate({ data }: Props) {
  let item: ItemData = {};
  
  if (typeof data.items === 'string') {
    try {
      const parsed = JSON.parse(data.items);
      item = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
      console.error("Failed to parse items:", e);
    }
  } else if (Array.isArray(data.items)) {
    item = data.items[0] || {};
  } else {
    item = data.items || {};
  }

  const productName = item.name || item.product_name || 'N/A';
  // 价格获取逻辑
  const displayPrice = item.unit_price || item.price || data.price || 0;

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      {/* 1. 抬头显示订单编号 */}
      <DocumentHeader title="OWNERSHIP CERTIFICATE" refNumber={data.id?.slice(0, 8) || 'N/A'} />
      
      <div className="text-center my-16 space-y-8">
        <h1 className="text-4xl font-bold uppercase italic tracking-widest">Certificate of Ownership</h1>
        <p className="text-lg">This is to certify that</p>
        <p className="text-3xl font-bold border-b-2 border-black inline-block px-8 py-2">
           {data.user_info?.userName || 'Valued Customer'}
        </p>
        <p className="text-lg">is the lawful owner of the product described below:</p>
      </div>

      <div className="my-12 p-8 border border-gray-400 bg-gray-50">
        <div className="grid grid-cols-2 gap-6 text-left text-lg">
          <p className="font-bold">Product Name:</p> 
          <p>{productName}</p>
          
          <p className="font-bold">Product Description:</p> 
          <p>{item.description || 'Standard E-FOIL Equipment'}</p>
          
          <p className="font-bold">Unit Price:</p> 
          <p>${Number(displayPrice).toLocaleString()}</p>
          
          {/* 2. UID 放在日期上方 */}
          <p className="font-bold">UID:</p> 
          <p className="font-mono">{data.uid || item.uid || 'N/A'}</p>
          
          {/* 3. 发证日期放在最后一项 */}
          <p className="font-bold">Issuance Date:</p> 
          <p>{data.created_at ? new Date(data.created_at).toLocaleDateString('en-US') : 'N/A'}</p>
        </div>
      </div>
      
      <button 
        onClick={() => typeof window !== 'undefined' && window.print()} 
        className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded font-bold hover:bg-gray-800"
      >
        Print Certificate
      </button>
    </div>
  );
}