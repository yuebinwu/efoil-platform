import DocumentHeader from '../DocumentHeader';

export default function OwnershipTemplate({ data }: { data: any }) {
  // 核心改動：直接在這裡解析 items，無論傳進來的是物件還是字串
  const item = typeof data.items === 'string' ? JSON.parse(data.items) : (data.items || {});

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      <DocumentHeader title="產權證明 (OWNERSHIP CERTIFICATE)" refNumber={item.uid || 'N/A'} />
      
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
          <p className="font-bold">Product Name:</p> <p>{item.name}</p>
          <p className="font-bold">Serial Number:</p> <p>{item.model}</p>
          <p className="font-bold">Issuance Date:</p> <p>{new Date(data.created_at).toLocaleDateString()}</p>
          <p className="font-bold">UID:</p> <p className="font-mono">{item.uid}</p>
        </div>
      </div>
      
      <button onClick={() => window.print()} className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded">
        打印證書
      </button>
    </div>
  );
}