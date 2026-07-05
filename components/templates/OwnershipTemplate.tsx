import DocumentHeader from '../DocumentHeader';

// 1. 定义数据接口，彻底消除 any
// 1. 定义 items 的具体结构，彻底消除 any
interface ItemData {
  name?: string;
  model?: string;
  description?: string;
  uid?: string;
}

interface OwnershipData {
  id: string;
  uid?: string;
  created_at: string;
  items: ItemData | string; // 支持对象或字符串格式
  user_info?: {
    userName?: string;
  };
}

interface Props {
  data: OwnershipData;
}
export default function OwnershipTemplate({ data }: Props) {
  // 2. 核心改動：直接在這裡解析 items，並給予類型安全
  const item = typeof data.items === 'string' ? JSON.parse(data.items) : (data.items || {});

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      <DocumentHeader title="OWNERSHIP CERTIFICATE" refNumber={data.uid || 'N/A'} />
      
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
          <p className="font-bold">Product Name:</p> <p>{item.name || 'N/A'}</p>
          <p className="font-bold">Product Description:</p> <p>{item.description || ''}</p>
          <p className="font-bold">Issuance Date:</p> <p>{data.created_at ? new Date(data.created_at).toLocaleDateString('en-US') : 'N/A'}</p>
          <p className="font-bold">UID:</p> <p className="font-mono">{data.uid || item.uid || 'N/A'}</p>
        </div>
      </div>
      
      <button 
        onClick={() => window.print()} 
        className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded font-bold hover:bg-gray-800"
      >
        Print Certificate
      </button>
    </div>
  );
}