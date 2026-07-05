'use client';
import DocumentHeader from '../DocumentHeader';

// 定义明确的数据结构接口
interface TransferData {
  transfer_no: string;
  assignee_name: string;
  assignee_phone: string;
  assignee_address: string;
  product_name: string;
  uid: string;
  price: number | string;
  package_status: string;
}

export default function TransferTemplate({ data }: { data: TransferData }) {
  // 移除所有 useEffect 和重复查询逻辑，直接使用传入的 data
  if (!data) return <div className="p-12 text-red-500">無法加載轉讓信息。</div>;

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      <DocumentHeader 
        title="產品轉讓證明 (PRODUCT TRANSFER CERTIFICATE)" 
        refNumber={data.transfer_no || 'N/A'} 
      />
      
      <div className="space-y-6 mt-12">
        <section className="p-6 border border-black bg-gray-50">
          <h2 className="font-bold border-b border-black mb-4 uppercase">1. Transferee Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {data.assignee_name}</p>
            <p><strong>Phone:</strong> {data.assignee_phone}</p>
            <p className="col-span-2"><strong>Address:</strong> {data.assignee_address}</p>
          </div>
        </section>

        <section className="p-6 border border-black">
          <h2 className="font-bold border-b border-black mb-4 uppercase">2. Product Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Product Name:</strong> {data.product_name}</p>
            <p><strong>UID:</strong> {data.uid}</p>
            <p><strong>Price:</strong> ${Number(data.price || 0).toLocaleString()}</p>
            <p><strong>Status:</strong> {data.package_status}</p>
          </div>
        </section>
      </div>

      <button onClick={() => window.print()} className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded w-full">
        打印轉讓證書
      </button>
    </div>
  );
}