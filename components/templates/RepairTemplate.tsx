// components/templates/RepairTemplate.tsx
import DocumentHeader from '../DocumentHeader';

// 1. 定义 RepairData 接口
export interface RepairData {
  id: string;
  product_name: string;
  uid: string;
  created_at: string;
  status: string;
  report?: string;
  price?: number | string;
}

// 2. 将 data 类型从 any 修改为 RepairData
export default function RepairTemplate({ data }: { data: RepairData }) {
  return (
    <div className="p-12 max-w-4xl mx-auto bg-white">
      <DocumentHeader title="維修報告" refNumber={data.id ? data.id.slice(0, 8) : 'N/A'} />
      
      <div className="grid grid-cols-2 gap-4 border-b pb-6 mb-6">
        <p><strong>產品名稱:</strong> {data.product_name}</p>
        <p><strong>UID:</strong> {data.uid}</p>
        <p><strong>申請日期:</strong> {data.created_at ? new Date(data.created_at).toLocaleDateString() : '-'}</p>
        <p><strong>維修狀態:</strong> <span className="text-blue-600 font-bold">{data.status}</span></p>
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold mb-2">維修內容與費用</h3>
        <p className="text-gray-700">{data.report || '無詳細報告'}</p>
        <div className="mt-8 border-t-2 border-black pt-4 text-right">
          <p className="text-xl font-bold">費用: ${data.price || '0'}</p>
        </div>
      </div>

      <button onClick={() => window.print()} className="bg-black text-white px-6 py-2 mt-10 print:hidden rounded">
        執行打印
      </button>
    </div>
  );
}