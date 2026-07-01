'use client';

export default function DocumentTemplate({ 
  children, 
  title, 
  docNumber, 
  date,
  companyName = "E-FOIL INC."
}: { 
  children: React.ReactNode; 
  title: string; 
  docNumber: string; 
  date: string;
  companyName?: string;
}) {
  return (
    <div className="max-w-[8.5in] mx-auto p-12 bg-white border border-gray-200 shadow-sm print:shadow-none print:p-0 my-8 relative">
      
      {/* 新增：列印按鈕區域 (列印時會隱藏) */}
      <div className="absolute top-4 right-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span>🖨️ 導出 PDF</span>
        </button>
      </div>

      {/* 頁首 */}
      <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-black">{companyName}</h1>
          <p className="text-sm text-gray-600 mt-1">123 Silicon Valley Blvd, CA 94025</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-gray-800">{title}</h2>
          <p className="text-sm font-mono mt-1 text-gray-600">REF: {docNumber}</p>
          <p className="text-sm text-gray-500">Date: {date}</p>
        </div>
      </div>

      {/* 內容區域 */}
      <div className="min-h-[600px]">
        {children}
      </div>

      {/* 頁尾簽名 */}
      <div className="mt-16 pt-8 border-t border-gray-300 flex justify-end">
        <div className="w-64 text-center">
          <div className="border-t border-black pt-2 text-sm uppercase font-semibold">Authorized Signature</div>
        </div>
      </div>
    </div>
  );
}