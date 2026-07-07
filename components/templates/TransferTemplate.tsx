'use client';
import DocumentHeader from '../DocumentHeader';

export interface TransferData {
  id: string;
  user_info?: { 
    id?: string; full_name?: string; email?: string; phone?: string; 
    street_address?: string; city?: string; state?: string; postal_code?: string; remarks?: string;
  };
  assignee_name?: string;
  assignee_phone?: string;
  assignee_address?: string;
  uid?: string;
  quantity?: number;
  price?: number | string;
  package_status?: string;
  note?: string; // 转让备注
  product_name?: string;
  description?: string;
}

export default function TransferTemplate({ data }: { data: TransferData }) {
  const p = data.user_info || {};

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      <DocumentHeader title="PRODUCT TRANSFER CERTIFICATE" refNumber={data.id} />
      
      <div className="space-y-8 mt-12">
        <section className="p-6 border border-black">
          <h2 className="text-xs font-bold uppercase text-gray-500 mb-2">1. USER INFORMATION</h2>
          <div className="text-lg space-y-1">
            <p className="font-bold">{p.full_name || 'Valued Customer'}</p>
            <p className="text-sm text-gray-600">Email: {p.email || 'N/A'}</p>
            <p className="text-sm text-gray-600">Tel: {p.phone || 'N/A'}</p>
            <p className="text-sm text-gray-600">Street_address: {p.street_address || 'N/A'}</p>
            <p className="text-sm text-gray-600">city: {p.city || 'N/A'}</p>
            <p className="text-sm text-gray-600">State: {p.state || 'N/A'}</p>
            <p className="text-sm text-gray-600">Postal_code: {p.postal_code || 'N/A'}</p>
           
            
          </div>
        </section>

        <section className="p-6 border border-black bg-gray-50">
          <h2 className="text-xs font-bold uppercase text-gray-500 mb-2">2. TRANSFEREE INFORMATION</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Assignee Name:</strong> {data.assignee_name || 'N/A'}</p>
            <p><strong>Assignee Phone:</strong> {data.assignee_phone || 'N/A'}</p>
            <p className="col-span-2"><strong>Address:</strong> {data.assignee_address || 'N/A'}</p>
            <p><strong>Price:</strong> ${Number(data.price || 0).toLocaleString()}</p>
            <p><strong>Package Status:</strong> {data.package_status || 'N/A'}</p>
            <p><strong>UID:</strong> {data.uid || 'N/A'}</p>
            <p><strong>Quantity:</strong> {data.quantity || 'N/A'}</p>
            
          </div>
        </section>

        <section className="p-6 border border-black">
          <h2 className="text-xs font-bold uppercase text-gray-500 mb-2">3. PRODUCT DETAILS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p className="col-span-2"><strong>Product Name:</strong> {data.product_name || 'N/A'}</p>
            <p className="col-span-2"><strong>Description:</strong> {data.description || 'N/A'}</p>
            <p><strong>UID:</strong> {data.uid || 'N/A'}</p>
          </div>
        </section>
      </div>

      <button 
        onClick={() => typeof window !== 'undefined' && window.print()} 
        className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded w-full hover:bg-gray-800"
      >
        打印轉讓證書
      </button>
    </div>
  );
}